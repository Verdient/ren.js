'use strict'

class UserError extends Error
{
	constructor(message, code, data){
		super(message);
		this.code = code;
		this.status = 500;
		this.data = data;
		this.type = 'User Error'
	}
}

module.exports = UserError;