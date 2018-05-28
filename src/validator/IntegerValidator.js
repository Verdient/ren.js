'use strict'

const NumberValidator = require('./NumberValidator');

class IntegerValidator extends NumberValidator {

	constructor(options){
		super(options);
		this.message = options.message || this.attribute + ' must be an integer';
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		if(value % 1 !== 0){
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = IntegerValidator;