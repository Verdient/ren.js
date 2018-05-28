'use strict'

const BaseModel = require('../base/BaseModel');
const stringHelper = require('../helpers/string');
const ActiveQuery = require('./ActiveQuery');

class ActiveRecord extends BaseModel {

	static tableName(){
		var className = this.className();

		var name = className.substr(className.lastIndexOf('.') + 1);

		return stringHelper.snakeCase(name);
	}

	get db(){
		let db = this.options.components.getComponent('db');
		if(db){
			return db.client;
		}
		return null;
	}

	static find(ctx){
		return new ActiveQuery({
			tableName: this.tableName(),
			model: new this(ctx)
		});
	}
}

module.exports = ActiveRecord;