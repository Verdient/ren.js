'use strict'

const Validator = require('./Validator');
const UnprocessableEntityError = require('../web/errors/UnprocessableEntityError');
const objectHelper = require('../helpers/object');

class RequiredValidator extends Validator {

	constructor(options){
		super(options);
		this.required = true;
		this.empty = options.message || this.empty;
	}
}

module.exports = RequiredValidator;