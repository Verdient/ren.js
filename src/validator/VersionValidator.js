'use strict'

const Validator = require('./Validator');

class VersionValidator extends Validator {

	constructor(options){
		super(options);
		this.separator = options.separator || '.';
		this.length = options.length || 3;
		this.message = options.message || this.attribute + ' is not a valid version number';
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		if(typeof value != 'string' || value.split(this.separator).length != this.length){
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = VersionValidator;