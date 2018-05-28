'use strict'

const Validator = require('./Validator');

class MobileValidator extends Validator {

	constructor(options){
		super(options);
		this.message = options.message || this.attribute + ' is not a valid mobile number';
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		let pattern = /^(13[0-9]|14[57]|15[012356789]|16[678]|17[0135678]|18[0-9]|199)[0-9]{8}$/;
		if((typeof value != 'string' && typeof value != 'number') || !pattern.test(String(value))){
			this.error = this.message;
		}
		return !this.hasError();
	}
}

module.exports = MobileValidator;