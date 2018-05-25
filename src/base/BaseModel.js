'use strict'

const BaseClass = require('./BaseClass');
const objectHelper = require('../helpers/object');

class BaseModel extends BaseClass {

	constructor(){
		super();
		this.attributes = {};
		this._scenario = null;
	}

	set scenario(value){
		this._scenario = value;
	}

	get scenario(){
		return this._scenario;
	}

	rules(){
		return {};
	}

	load(data){
		this.attributes = data;
	}

	async validate(){
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
		return new Promise((resolve, revoke) => {
			resolve(true);
		});
	}
}

module.exports = BaseModel;