'use strict'

const BaseClass = require('base/BaseClass');

class Response extends BaseClass {

	constructor(response, request, options){
		super();
		this.request = request;
		this.response = response;
		this.formaterMap = options.formaterMap;
		this._status = 200;
		this._body = null;
		this._headers = {
			'Content-Type': 'application/json'
		};
		if(request.accept){
			this._headers['Content-Type'] = this.getContentType();
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

	getContentType(){
		let request = this.request;
		let acceptObject = request.acceptObject;
		for(var i in acceptObject){
			for(var m of acceptObject[i]){
				if(typeof this.formaterMap[m] != 'undefined'){
					return m;
				}
			}
		}
		return false
	}
}

module.exports = Response;