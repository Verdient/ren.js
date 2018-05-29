'use strict'

const HttpError = require('./HttpError');

class BadGateWayError extends HttpError
{
	constructor(message, code, data){
		super(message || 'BadGate Way', 502, code, data);
		this.type = 'BadGate Way Error'
	}
}

module.exports = BadGateWayError;