const BaseClass = require('base/BaseClass');
const objectHelper = require('helpers/object');

class LoggerTarget extends BaseClass {

	constructor(options){
		super();
		this.levels = options.levels || '*';
	}

	levelEnabled(level){
		if(this.levels == '*'){
			return true;
		}
		return objectHelper.inArray(level, this.levels);
	}

	log(level, data){
		if(this.levelEnabled(level)){
			console.log(data);
		}
	}
}

module.exports = LoggerTarget;