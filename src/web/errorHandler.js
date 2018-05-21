'use strict'

// const translation = require('components/translation')();

module.exports = (ctx, options) => {
	let error = ctx.error;
	if(error){
		if(options.RESTful){
			ctx.response.status = error.status || 500;
			ctx.response.body = {message: error.message};
		}else{
			ctx.response.status = 200;
			ctx.response.body = {
				code: error.code || error.status || 500,
				message: error.message
			};
		}
	}
}