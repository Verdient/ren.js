'use strict';

const xmlbuilder = require('xmlbuilder');

module.exports = (body) => {
	return xmlbuilder.create(body).end();
}