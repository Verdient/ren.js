'use strict'

const BaseClass = require('base/BaseClass');

class Components extends BaseClass {

	constructor(options){
		super();
		this.components = {};
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
}

module.exports = Components;