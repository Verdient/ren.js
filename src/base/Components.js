'use strict'

const BaseClass = require('./BaseClass');
const components = require('../components/components');

class Components extends BaseClass {

	constructor(options){
		super();
		this.components = components;
		if(typeof options == 'object'){
			this.register(options);
		}
	}

	register(options){
		for(var i in options){
			if(typeof options[i] == 'string'){
				this.components[i] = new require(options[i]);
			}else{
				if(typeof options[i].module == 'undefined'){
					throw new Error('Components module must be set');
				}
				let Component = require(options[i].module);
				this.components[i] = new Component(options[i]);
			}
		}
	}

	getComponent(name){
		if(typeof this.components[name] != 'undefined'){
			return this.components[name];
		}
		return null;
	}
}

module.exports = Components;