'use strict';

const components = require('./index');

module.exports = (config) => {
	for(var i in config){
		if(typeof config[i] == 'string'){
			components[i] = require(config[i])();
			if(typeof components[i].init == 'function'){
				var result = components[i].init();
				if(result){
					components[i] = result;
				}
			}
		}else{
			if(typeof config[i].module == 'undefined'){
				throw new Error('Components module must be set');
			}
			components[i] = require(config[i].module)();
			for(var m in config[i]){
				if(m != 'module'){
					components[i][m] = config[i][m];
				}
			}
			if(typeof components[i].init == 'function'){
				var result = components[i].init();
				if(result){
					components[i] = result;
				}
			}
		}
	}
}