'use strict'

const Router = require('web/Router');

class Site extends Router {

	actionIndex(){
		let ctx = this.ctx;
		let next = this.next;
		ctx.response.body = new Map()
		next();
	}
}

module.exports = Site;
