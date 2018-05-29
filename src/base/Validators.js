'use strict'

const BaseClass = require('./BaseClass');
const validators = require('../validator/validators');

class Validators extends BaseClass {

	constructor(options){
		super();
		this.validators = validators;
		if(typeof options == 'object'){
			this.register(options);
		}
	}

	register(options){
		for(var i in options){
			if(typeof options[i] == 'string'){
				this.validators[i] = require(options[i]);
			}
		}
	}

	getValidator(name, options){
		if(this.validators[name]){
			return new this.validators[name](options);
		}
		return false;
	}
}

module.exports = Validators;