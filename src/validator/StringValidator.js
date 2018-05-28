'use strict'

const Validator = require('./Validator');

class StringValidator extends Validator {

	constructor(options){
		super(options);
		this.length = options.length || null;
		this.min = options.min || null;
		this.max = options.max || null;
		this.wrongLength = options.wrongLength || this.attribute + ' length must be ' + this.length;
		this.tooShort = options.tooShort || this.attribute + ' must longer than ' + this.min;
		this.tooLong = options.tooLong || this.attribute + ' must shorter than ' + this.max;
		this.message = options.message || this.attribute + ' must be a string';
	}

	async validate(value){
		if(!await super.validate(value)){
			return false;
		}
		if(typeof value != 'string' && typeof value != 'number'){
			this.error = this.message;
		}else{
			let length = String(value).length;
			if(this.length){
				if(length != this.length){
					this.error = this.wrongLength;
				}else{
					if(this.min){
						this.error = this.tooShort;
					}
					if(this.max){
						this.error = this.tooLong;
					}
				}
			}
		}
		return !this.hasError();
	}
}

module.exports = StringValidator;