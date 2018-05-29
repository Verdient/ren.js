'use strict'

const BaseModel = require('../base/BaseModel');
const Components = require('../base/Components');
const stringHelper = require('../helpers/string');
const ActiveQuery = require('./ActiveQuery');

class ActiveRecord extends BaseModel {

	constructor(scenario, attributes){
		super(scenario, attributes);
		this.extends = {};
	}

	tableName(){
		var className = this.className();

		var name = className.substr(className.lastIndexOf('.') + 1);

		return stringHelper.snakeCase(name);
	}

	get db(){
		let db = new Components().getComponent('db');
		if(db){
			return db.client;
		}
		return null;
	}

	find(){
		return new ActiveQuery(this);
	}
}

module.exports = ActiveRecord;