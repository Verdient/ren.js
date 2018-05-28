'use strict'

const Validator = require('./Validator');

class NumberValidator extends Validator {

	constructor(options){
		super(options);
		this.min = options.min || null;
		this.max = options.max || null;
		this.tooSmall = options.tooSmall || this.attribute + ' can not smaller than ' + this.min;
		this.tooBig = options.tooBig || this.attribute + ' can not greater than ' + this.max;
		this.message = options.message || this.attribute + ' must be an number';
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		if(!isNaN(value)){
			this.error = this.message;
		}
		if(Number(value) < this.min){
			this.error = this.tooSmall;
		}
		if(Number(value) > this.max){
			this.error = this.tooBig;
		}
		return !this.hasError();
	}
}

module.exports = NumberValidator;