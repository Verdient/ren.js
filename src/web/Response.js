'use strict'

class Response {
	constructor(response, request){
		this.response = response;
		this._status = 200;
		this._body = null;
		this._headers = {
			'Content-Type': 'application/json'
		};
		if(request.accept){
			this._headers['Content-Type'] = request.accept;
		}
	}

	get isSent(){
		return this.response.finished;
	}

	get isHeadersSent(){
		return this.response.headersSent;
	}

	get status(){
		return this._status;
	}

	set status(status){
		this._status = status;
	}

	get body(){
		return this._body;
	}

	set body(value) {
		this._body = value;
		if(null == value){
			this.removeHeader('Content-Type', 'Content-Length', 'Transfer-Encoding');
			return;
		}
	}

	get headers(){
		return this._headers;
	}

	getHeader(name){
		return this._headers[name] || null;
	}

	setHeader(name, value){
		this._headers[name] = value;
	}

	removeHeader(...headers){
		headers.forEach(header => {
			delete this._headers[header];
		});
	}
}

module.exports = Response;