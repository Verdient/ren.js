'use strict'

const BaseClass = require('./BaseClass');
const Errors = require('./Errors');
const objectHelper = require('../helpers/object');

class BaseModel extends BaseClass {

	constructor(options){
		super();
		this.options = options;
		this.validators = options.validators || {};
		this.attributes = {};
		this._scenario = null;
		this._scenarioRules = {};
		this._errors = new Errors();

		return new Proxy(this, {
			get: function(model, attribute) {
				let attributes = model.attributes;
				if(attribute in attributes){
					return attributes[attribute];
				}
				return model[attribute];
			},
			set: function(model, attribute, value){
				let attributes = model.attributes;
				if(attribute in attributes){
					return attributes[attribute] = value;
				}
				return model[attribute] = value;
			}
		});
	}

	set scenario(value){
		this._scenario = value;
	}

	get scenario(){
		return this._scenario;
	}

	get scenarioRules(){
		if(!this._scenarioRules[this.scenario]){
			let rules = this.rules();
			let scenarioRules = {};
			for(var i in rules){
				rules[i].forEach(rule => {
					if(!rule.on){
						if(!scenarioRules[i]){
							scenarioRules[i] = [];
						}
						scenarioRules[i].push(rule);
					}else{
						if(objectHelper.inArray(this._scenario, rule.on)){
							delete rule.on;
							if(!scenarioRules[i]){
								scenarioRules[i] = [];
							}
							scenarioRules[i].push(rule);
						}
					}
				});
			}
			this._scenarioRules[this.scenario] = scenarioRules;
		}
		return this._scenarioRules[this.scenario];
	}

	rules(){
		return {};
	}

	load(data){
		this.attributes = data;
	}

	addError(attribute, error){
		return this._errors.addError(attribute, error);
	}

	hasErrors(){
		return this._errors.hasErrors();
	}

	get errors(){
		return this._errors;
	}

	async validate(){
		let scenarioRules = this.scenarioRules;
		for(let attribute in scenarioRules){
			let rules = scenarioRules[attribute];
			for(var rule of rules){
				let validator = this.validators.getValidator(rule.type, rule);
				if(!validator){
					throw new Error('Unsupported validate type: ' + rule.type);
				}else{
					if(!await validator.validate(this.attributes[attribute])){
						this.addError(attribute, validator.error);
					}
				}
			}
		}
		return !this.hasErrors();
	}
}

module.exports = BaseModel;