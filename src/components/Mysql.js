'use strict';

const mysql = require('mysql2');

const Component = require('../base/Component');

class Mysql extends Component {
	constructor(options){
		super();
		this.host = options.host || 'localhost';
		this.port = options.port || 3306;
		this.username = options.username || 3306;
		this.password = options.password || null
		this.database = options.database || null;
		this.client = mysql.createConnection({
			host: this.host,
			port: this.port,
			user: this.username,
			password: this.password,
			database: this.database
		});
	}
}

module.exports = Mysql;