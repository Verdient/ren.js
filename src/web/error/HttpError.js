'use strict'

class HttpError extends Error
{
	constructor(message, status, code, data){
		super(message, data);
		this.status = status;
		this.code = code;
		this.type = 'Http Error'
	}
}

module.exports = HttpError;