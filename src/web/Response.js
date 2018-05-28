'use strict'

const BaseClass = require('base/BaseClass');
const objectHeler = require('helpers/object');

class Response extends BaseClass {

	constructor(response, request, options){
		super();
		this.request = request;
		this.response = response;
		this.formatter = options.formatter;
		this.defaultContentType = options.defaultContentType || false;
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

	set body(value){
		if(null == value){
			this.removeHeader('Content-Type', 'Content-Length', 'Transfer-Encoding');
		}else{
			let type = objectHeler.type(value);
			switch(type){
				case 'string': case 'number':
					this._body = {message: value};
					break;
				case 'object': case 'array':
					this._body = value;
					break;
				default:
					this.status = 500;
					this.body = 'Response body must be the following type: Object, String, Array, ' + type.substr(0, 1).toUpperCase() + type.substr(1) + ' is unsupported';
					break;
			}
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
		let acceptSeries = request.acceptSeries;
		if(acceptSeries.length > 0){
			for(let i of acceptSeries){
				if(typeof this.formatter[i] != 'undefined'){
					return i;
				}
				if(i == '*/*'){
					return this.defaultContentType;
				}
			}
			return false;
		}else{
			return this.defaultContentType;
		}
	}
}

module.exports = Response;