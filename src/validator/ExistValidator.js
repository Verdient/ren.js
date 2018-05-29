'use strict'

const Validator = require('./Validator');

class ExistValidator extends Validator {

	constructor(options){
		super(options);
		this.targetModel = options.targetModel || options.model;
		this.targetAttribute = options.targetAttribute || this.attribute;
		this.filter = options.filter || {};
		this.operator = options.operator || '=';
		this.skipOnError = options.skipOnError || true;
		this.message = options.message || this.attribute + ' Mismatch';
	}

	async validate(value){
		if(this.beforeValidate){
			value = this.beforeValidate(value);
		}
		let query = this.targetModel.find();
		let where = {};
		where[this.targetAttribute] = [this.operator, value];
		query.where(where);
		query.filterWhere(this.filter);
		let result = await query.one();
		if(result){
			if(this.export){
				this.exports = result;
			}
		}else{
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = ExistValidator;