'use strict'

class UserError extends Error
{
	constructor(message, code, data){
		super(message);
		if(!isNaN(message) && !code){
			code = message;
		}
		this.data = data;
		this.code = code;
		this.type = 'User Error'
	}
}

module.exports = UserError;