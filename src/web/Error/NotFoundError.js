'use strict'

const UserError = require('../../base/UserError');

class NotFoundError extends UserError
{
	constructor(message, code, data){
		super(message || 'Not Found', code, data);
		this.status = 404;
		this.type = 'Not Found Error'
	}
}

module.exports = NotFoundError;