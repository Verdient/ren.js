'use strict'

const HttpError = require('./HttpError');

class ForbiddenError extends HttpError
{
	constructor(message, code, data){
		super(message || 'Forbidden', 403, code, data);
		this.type = 'Forbidden Error'
	}
}

module.exports = ForbiddenError;