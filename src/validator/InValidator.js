'use strict'

const Validator = require('./Validator');
const objectHelper = require('../helpers/object');

class InValidator extends Validator {

	constructor(options){
		super(options);
		this.range = options.range || [];
		this.message = options.message || this.attribute + ' must in the following values:' + this.range.join(', ');
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		if(!objectHelper.inArray(value, this.range)){
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = InValidator;