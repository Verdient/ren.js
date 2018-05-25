'use strict';

const redis = require('redis');

const Component = require('base/Component');

class Redis extends Component {
	constructor(options){
		super();
		this.host = options.host || 'localhost';
		this.port = options.port || 6379;
		this.password = options.password || '';
		this.db = options.db || 0;
		this.client = redis.createClient({
			host: this.host,
			port: this.port,
			password: this.password,
			db: this.db
		});
	}
}

module.exports = Redis;