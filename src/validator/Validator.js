'use strict'

const BaseClass = require('../base/BaseClass');
const objectHelper = require('../helpers/object');
const UnprocessableEntityError = require('../web/errors/UnprocessableEntityError');

class Validator extends BaseClass {

	constructor(options){
		super();
		this.attribute = options.attribute || 'attribute';
		this.required = options.required || false;
		this.empty = options.empty || this.attribute + ' can not be blank';
		this.skipOnError = options.skipOnError || false;
		this.beforeValidate = options.beforeValidate || null;
		this.afterValidate = options.afterValidate || null;
		this.export = options.export || false;
		this.exports = {};
		this._error = null;
	}

	static isEmpty(value){
		switch(objectHelper.type(value)){
			case 'array': case 'string':
				return value.length == 0;
			case 'object':
				return objectHelper.isEmptyObject(value);
			case 'undefined':
				return true;
			case 'set': case 'map':
				return value.size == 0;
		}
		return false;
	}

	set error(message){
		this._error = new UnprocessableEntityError(message);
	}

	get error(){
		return this._error;
	}

	hasError(){
		return this._error !== null;
	}

	async validate(value){
		if(this.required){
			if(Validator.isEmpty(value)){
				this.error = this.empty;
			}
		}
		return !this.hasError();
	}
}

module.exports = Validator;