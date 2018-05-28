'use strict'

const BaseClass = require('./BaseClass');
const objectHelper = require('../helpers/object');

class Errors extends BaseClass {
	constructor(){
		super();
		this._errors = {};
	}

	addError(name, error){
		if(typeof this._errors[name] == 'undefined'){
			this._errors[name] = [];
		}
		this._errors[name].push(error);
	}

	get errors(){
		return this._errors;
	}

	hasErrors(){
		return !objectHelper.isEmptyObject(this._errors);
	}

	getError(name){
		return this._errors[name] || null;
	}

	getFirstError(){
		for(let name in this._errors){
			return this._errors[name][0] || null;
		}
		return null;
	}
}

module.exports = Errors;