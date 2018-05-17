'use strict';

const xml2js = require('xml2js');

module.exports = (body) => {
	let builder = new xml2js.Builder();
	return builder.buildObject(body);
}