'use strict';

const filters = require('./index');

module.exports = (config) => {
	for(var i in config){
		if(typeof config[i] == 'string'){
			filters[i] = require(config[i])();
			if(typeof filters[i].init == 'function'){
				var result = filters[i].init();
				if(result){
					filters[i] = result;
				}
			}
		}else{
			if(typeof config[i].module == 'undefined'){
				throw new Error('filters module must be set');
			}
			filters[i] = require(config[i].module)();
			for(var m in config[i]){
				if(m != 'module'){
					filters[i][m] = config[i][m];
				}
			}
			if(typeof filters[i].init == 'function'){
				var result = filters[i].init();
				if(result){
					filters[i] = result;
				}
			}
		}
	}
}