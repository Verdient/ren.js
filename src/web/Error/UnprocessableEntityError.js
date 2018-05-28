'use strict'

const HttpError = require('./HttpError');

class UnprocessableEntityError extends HttpError
{
	constructor(message, code, data){
		super(message || 'Not Found', 422, code, data);
		this.type = 'Unprocessable EntityError Error'
	}
}

module.exports = UnprocessableEntityError;