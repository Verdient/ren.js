'use strict'

const path = require('path');
const routers = require('./routers');

module.exports = (files, options) => {
	files.forEach(function(file){
		var routerName = path.basename(file, '.js');
		routers[routerName] =  require(file);
	});
}