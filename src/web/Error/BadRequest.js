'use strict'

const HttpError = require('./HttpError');

class BadRequestError extends HttpError
{
	constructor(message, code, data){
		super(message || 'Bad Request', 400, code, data);
		this.type = 'Bad Request Error'
	}
}

module.exports = BadRequestError;