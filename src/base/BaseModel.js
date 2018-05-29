'use strict'

const BaseClass = require('./BaseClass');
const Errors = require('./Errors');
const Validators = require('../base/Validators');
const objectHelper = require('../helpers/object');

class BaseModel extends BaseClass {

	constructor(scenario, attributes){
		super();
		this.attributes = {};
		this.scenario = scenario || null;
		this._scenarioRules = {};
		this._errors = new Errors();

		if(typeof attributes == 'object'){
			this.load(attributes);
		}
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
						if(objectHelper.inArray(this.scenario, rule.on)){
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
				rule.model = this;
				rule.attribute = attribute;
				let validator = new Validators().getValidator(rule.type, rule);
				if(!validator){
					throw new Error('Unsupported validate type: ' + rule.type);
				}else{
					if(validator.skipOnError !== true || !this.hasErrors()){
						if(!await validator.validate(this.attributes[attribute])){
							this.addError(attribute, validator.error);
						}
						if(validator.export){
							this.extends[validator.export] = validator.exports;
						}
					}
				}
			}
		}
		return !this.hasErrors();
	}
}

module.exports = BaseModel;