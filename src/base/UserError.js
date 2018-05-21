'use strict'

class UserError extends Error
{
	constructor(message, data){
		super(message);
		this.data = data;
		this.type = 'User Error'
	}
}

module.exports = UserError;