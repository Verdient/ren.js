'use strict'

const UserError = require('../../base/UserError');

class HttpError extends UserError
{
	constructor(message, status, code, data){
		super(message, code, data);
		this.status = status;
		this.type = 'Http Error'
	}
}

module.exports = HttpError;