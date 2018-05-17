'use strict'

class Logger {
	constructor(){
		this.lever = 'log'
	}

	// lever

	info(...args){
		console.info(...args);
	}
}

module.exports = Logger;