'use strict'

// const translation = require('components/translation')();
const BaseClass = require('../base/BaseClass');
const Errors = require('../base/Errors');

class ErrorHandler extends BaseClass {

	constructor(options){
		super();
		this.multiErrors = options.multiErrors || false;
		this.translation = options.translation || null;
	}

	handleError(ctx){
		let error = ctx.error;
		if(error){
			if(error instanceof Errors){
				if(this.multiErrors === true){
					let body = {'message': 'There were some mistakes', data: {}};
					let status = 500;
					let errors = error.errors;
					for(var name in errors){
						if(typeof body['data'][name] == 'undefined'){
							body['data'][name] = [];
						}
						for(let error of errors[name]){
							status = error.status || status;
							if(this.translation && error.message == error.code){
								error.message = this.translation.format('error', error.message, ctx.request.getHeader('Accept-Language'));
							}
							body['data'][name].push(error.message);
						}
					}
					ctx.response.status = status;
					ctx.response.body = body;
				}else{
					error = error.getFirstError();
				}
			}
			if(error instanceof Error){
				if(this.translation && error.message == error.code){
					error.message = this.translation.format('error', error.message, ctx.request.getHeader('Accept-Language'));
				}
				ctx.response.status = error.status || 500;
				ctx.response.body = {
					code: error.code || error.status || 500,
					message: error.message
				};
			}
		}
	}
}

module.exports = ErrorHandler;