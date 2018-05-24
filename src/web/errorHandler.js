'use strict'

// const translation = require('components/translation')();

module.exports = (ctx) => {
	let error = ctx.error;
	if(error){
		ctx.response.status = error.status || 500;
		ctx.response.body = error.message;
	}
}