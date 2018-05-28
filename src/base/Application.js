'use strict';

const http = require('http');
const Components = require('../base/Components');
const Validators = require('base/Validators');
const Request = require('web/Request');
const Response = require('web/Response');
const Filters = require('web/Filters');
const Routers = require('web/Routers');
const Router = require('web/Router');
const objectHelper = require('helpers/object');

const defaultConfig = {
	host: 'localhost',
	port: 80,
	request: {
		parser: {
			'application/json': '../web/requestParser/JSON',
		}
	},
	response: {
		formatter: {
			'application/json': '../web/responseFormatter/JSON',
			'application/xml': '../web/responseFormatter/XML'
		},
		defaultContentType: 'application/json',
		RESTful: false
	},
	errorHandler: {
		module: '../web/ErrorHandler',
		multiErrors: false
	},
	router: {
		defaultRouter: 'site',
		defaultAction: 'index',
		routerSeparator: '-',
		actionSeparator: '-'
	},
	logger: {
		module: '../log/Logger',
		targets: {
			default: {
				module: '../log/target/ConsoleTarget',
				levels: '*'
			}
		}
	},
	i18n: {
		module: '../i18n/Translation',
	},
	validators: {
		'required': '../validator/RequiredValidator',
		'number': '../validator/NumberValidator',
		'integer': '../validator/IntegerValidator',
		'string': '../validator/StringValidator',
		'in': '../validator/InValidator',
		'uuid': '../validator/UUIDValidator',
		'mobile': '../validator/MobileValidator',
		'email': '../validator/EmailValidator',
		'version': '../validator/VersionValidator'
	}
}

class Application {
	constructor(config){
		this.config = objectHelper.merge(defaultConfig, config);
		this.validateConfig(this.config);
		this.listen({
			host: this.config.host,
			port: this.config.port
		});
		let Logger = require(this.config.logger.module);
		let ErrorHandler = require(this.config.errorHandler.module);
		let Translation = require(this.config.i18n.module);
		this.translation = new Translation(this.config.i18n);
		this.config.errorHandler.translation = this.translation;
		this.logger = new Logger(this.config.logger);
		this.errorHandler = new ErrorHandler(this.config.errorHandler);
		this.filters = new Filters(this.config.filters);
		this.routers = new Routers(this.config.router);
		this.validators = new Validators(this.config.validators);
		this.components = new Components(this.config.components);
	}

	validateConfig(config){
		if(isNaN(config.port) || config.port < 0 || config.port > 65535){
			throw new Error('Application listen port must be an effective port number');
		}
	}

	listen(options){
		const server = http.createServer((request, response) => {
			let body = [];
			request.on('data', (buffer) => {
				body.push(buffer);
			});
			request.on('end', () => {
				request.body = Buffer.concat(body).toString();
				this.handleRequest(request, response);
			});
		});
		return server.listen(options, () => {
			this.logger.info('Application listen on ' + options.host + ':' + options.port + ' succeed');
		});
	}

	async handleRequest(request, response){
		let ctx = {};
		ctx.request = new Request(request, this.config.request);
		ctx.response = new Response(response, ctx.request, this.config.response);
		ctx.components = this.components;
		ctx.validators = this.validators;
		ctx.filters = this.filters;
		ctx.routers = this.routers;
		if(ctx.request.error){
			ctx.error = ctx.request.error;
		}else{
			await ctx.filters.run(ctx) && await ctx.routers.run(ctx);
		}
		this.errorHandler.handleError(ctx);
		this.handleResponse(ctx.response, this.config.response);
	}

	handleResponse(response, options){
		const res = response.response;
		res.statusCode = options.RESTful ? response.status : 200;
		for(var i in response.headers){
			res.setHeader(i, response.headers[i]);
		}
		let body = response.body;
		if(body !== null){
			let contentType = response.getHeader('Content-Type');
			if(!options.RESTful && !body.code){
				body = Object.assign({code: response.status}, body);
			}
			if(response.formatter[contentType]){
				let formatter = require(response.formatter[contentType]);
				body = formatter(body);
			}else{
				res.statusCode = 406;
				body = null;
			}
		}
		res.end(body);
	}
}

module.exports = Application;