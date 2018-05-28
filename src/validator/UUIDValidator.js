'use strict'

const Validator = require('./Validator');

class UUIDValidator extends Validator {

	constructor(options){
		super(options);
		this.version = options.version || null;
		this.message = options.message || this.attribute + ' is not a valid uuid' + this.version ? ' v' + this.version : '';
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		let patterns = {
			1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
			3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
			4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
			5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
			all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
		};
		let version = this.version || 'all';
		let pattern = patterns[version];
		if(typeof value != 'string' || !pattern || !pattern.test(value)){
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = UUIDValidator;