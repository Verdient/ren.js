'use strict'

const Validator = require('./Validator');

class EmailValidator extends Validator {

	constructor(options){
		super(options);
		this.message = options.message || this.attribute + ' is not a valid email address';
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		let pattern = /^[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+\\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
		if(typeof value != 'string' || !pattern.test(value)){
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = EmailValidator;