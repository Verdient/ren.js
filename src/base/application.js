'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const Request = require('../web/Request');
const Response = require('../web/Response');
const registerRouter = require('../web/router/register');
const routerAction = require('../web/router/action');
const errorHandler = require('../base/errorHandler');
const Logger = require('../log/Logger');
const logger = new Logger();

const defaultConfig = {
	host: 'localhost',
	port: 80,
	response: {
		formaterMap: {
			'application/json': '../web/responseFormatter/JSON',
			'application/xml': '../web/responseFormatter/XML'
		},
		RESTful: false
	},
	router: {
		defaultRouter: 'site',
		defaultAction: 'index',
		routerSeparator: '-',
		actionSeparator: '-'
	}
}

class Application {
	constructor(config){
		this.config = Object.assign(defaultConfig, config);
		this.validateConfig(this.config);
		this.listen({
			host: this.config.host,
			port: this.config.port
		});
		if(typeof this.config.components == 'object'){
			let registerComponents = require('../components/register');
			registerComponents(this.config.components);
		}

		let realPath = fs.realpathSync('routers');
		let routers = fs.readdirSync('routers');
		routers.forEach((value, index) => {
			routers[index] = path.join(realPath, value)
		});
		registerRouter(routers);
	}

	validateConfig(config){
		if(isNaN(config.port) || config.port < 0 || config.port > 65535){
			throw new Error('Application listen port must be an effective port number');
		}
	}

	listen(options){
		const server = http.createServer((request, response) => {
			this.handleRequest(request, response);
		});
		return server.listen(options, () => {
			logger.info('Application listen on ' + options.host + ':' + options.port + ' succeed');
		});
	}

	async handleRequest(request, response){
		let ctx = {};
		ctx.request = new Request(request);
		ctx.response = new Response(response, ctx.request);
		ctx.components = this.components;
		await routerAction(ctx, this.config.router);
		errorHandler(ctx, this.config.response);
		this.handleResponse(ctx.response, this.config.response);
	}

	handleResponse(response, options){
		const res = response.response;
		res.statusCode = response.status;
		for(var i in response.headers){
			res.setHeader(i, response.headers[i]);
		}
		let body = response.body;
		if(!options.RESTful && !body.code){
			body = Object.assign({code: response.status}, body);
		}
		if(body !== null){
			let contentType = response.getHeader('Content-Type');
			if(options.formaterMap[contentType]){
				let formatter = require(options.formaterMap[contentType]);
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