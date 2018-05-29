'use strict'

const HttpError = require('./HttpError');

class NotFoundError extends HttpError
{
	constructor(message, code, data){
		super(message || 'Not Found', 404, code, data);
		this.type = 'Not Found Error'
	}
}

module.exports = NotFoundError;