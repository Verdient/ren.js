'use strict'

const Url = require('url');
const BaseClass = require('../base/BaseClass');
const BadRequestError = require('../web/errors/BadRequestError');
const objectHelper = require('../helpers/object');

class Request extends BaseClass {

	constructor(request, options){
		super();
		this.parser = options.parser;
		this.request = request;
		this.headers = request.headers;
		let url = Url.parse(request.url);
		let query = url.query;
		query = decodeURI(query);
		query = query.split('&');
		this.query = {};
		query.forEach(value => {
			var tmp = value.split('=');
			this.query[tmp[0]] = decodeURIComponent(tmp[1]);
		});
		this.path = url.pathname;
		if(this.path.charAt(this.path.length - 1) == '/'){
			this.path = this.path.substr(0, this.path.length - 1);
		}
		if(!this.path){
			this.path = '/';
		}
		this._acceptSeries = null;
		let contentType = this.getHeader('Content-Type');
		if(this.parser[contentType]){
			let parser = require(this.parser[this.getHeader('Content-Type')]);
			try{
				this._body = parser(this.request.body);
			}catch(e){
				this.error = new BadRequestError(e.message);
			}
		}else{
			this.error = new BadRequestError('Unsupported Content-type: ' + contentType);
		}
	}

	get origin(){
		return this.headers.origin || null;
	}

	get contentType(){
		return this.headers['content-type'] || 'application/json';
	}

	get ip(){
		return this.headers['x-real-ip'] || this.headers['x-forwarded-for'] || this.request.connection.remoteAddress;
	}

	get accept(){
		return this.headers['accept'] || 'application/json';
	}

	get acceptSeries(){
		if(!this._acceptSeries){
			this._acceptSeries = [];
			let accept = this.headers['accept'];
			let acceptObject = {};
			accept = accept.split(',');
			accept.forEach((value, index) => {
				accept[index] = value.split(';');
				if(accept[index].length == 2){
					accept[index][1] = accept[index][1].split('=')[1];
				}else{
					accept[index][1] = 1;
				}
				if(!acceptObject[accept[index][1]]){
					acceptObject[accept[index][1]] = new Set();
				}
				acceptObject[accept[index][1]].add(accept[index][0]);
			});
			let keys = Object.keys(acceptObject).sort((x, y) => {
				if(Number(x) > Number(y)){
					return -1;
				}else if(Number(x) == Number(y)){
					return 0
				}else{
					return 1;
				}
			});
			keys.forEach(key => {
				for(let accept of acceptObject[key]){
					this._acceptSeries.push(accept);
				}
			});
		}
		return this._acceptSeries;
	}

	get body(){
		return this._body;
	}

	getHeader(name){
		name = name.toLowerCase();
		return this.headers[name];
	}
}

module.exports = Request;