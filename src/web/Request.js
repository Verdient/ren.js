'use strict'

const Url = require('url');

class Request {
	constructor(request, parser){
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
		// this.body = request.body;
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

	get router(){
		let path = this.path.split('/');
		return path[1] || '/';
	}

	get action(){
		let path = this.path.split('/');
		return path[2] || '/';
	}
}

module.exports = Request;