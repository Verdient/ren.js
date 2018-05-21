const HttpError = require('./HttpError');

class AuthenticationError extends HttpError
{
	constructor(message, code, data){
		super(message || 'Authentication Error', 401, code, data);
		this.type = 'Authentication Error'
	}
}

module.exports = AuthenticationError;