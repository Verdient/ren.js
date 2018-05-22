'use strict'

const BaseClass = require('base/BaseClass');

class Router extends BaseClass {

	constructor(ctx){
		super();
		this.ctx = ctx;
		this.next = () => {}
	}
}

module.exports = Router;