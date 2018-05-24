'use strict'

const objectHelper = require('helpers/object');

class Logger {
	constructor(options){
		this.lever = 0;
		this.targets = {};
		let targets = options.targets;
		for(let i in targets){
			let Target = require(targets[i].module || './target/ConsoleTarget');
			this.targets[i] = new Target(targets[i]);
		}
	}

	trace(data, target){
		this.log('trace', data, target);
	}

	info(data, target){
		this.log('info', data, target);
	}

	warning(data, target){
		this.log('warning', data, target);
	}

	error(data, target){
		this.log('error', data, target);
	}

	log(type, data, target){
		target = typeof target == 'string' ? target : 'default';
		if(typeof this.targets[target] != 'undefined'){
			let Target = this.targets[target];
			Target.log(type, data);
		}
	}
}

module.exports = Logger;