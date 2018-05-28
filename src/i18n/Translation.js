'use strict'

const fs = require('fs');
const BaseClass = require('../base/BaseClass');

class Translation extends BaseClass {

	constructor(options){
		super();
		this.language = options.language || 'en-US';
		this.maps = {};
		this.register();
	}

	register(){
		let languages = fs.readdirSync('message');
		languages.forEach(language => {
			if(typeof this.maps[language] == 'undefined'){
				this.maps[language] = {};
			}
			let files = fs.readdirSync('message/' + language);
			files.forEach(file => {
				this.maps[language][file.replace('.js', '')] = require(fs.realpathSync('message/' + language + '/' + file));
			});
		});
	}

	getMap(type, language){
		return typeof this.maps[language] == 'object' && typeof this.maps[language][type] == 'object' ? this.maps[language][type] : false;
	}

	format(type, value, language){
		if(!language){
			language = this.language;
		}
		let map = this.getMap(type, language);
		if(map && map[value]){
			return map[value];
		}
		return value;
	}
}

module.exports = Translation;