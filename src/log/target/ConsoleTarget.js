const LoggerTarget = require('./LoggerTarget');

class ConsoleTarget extends LoggerTarget {

	constructor(options){
		super(options);
		let map = new Map();
		map.set('trace', console.log);
		map.set('info', console.info);
		map.set('warning', console.warn);
		map.set('error', console.error);
		this.levelMap = map;
	}

	log(level, data){
		if(this.levelEnabled(level)){
			let logger = this.levelMap.get(level);
			let date = new Date();
			process.stdout.write(date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' [' + level + '] ');
			logger(data);
		}
	}
}

module.exports = ConsoleTarget;