'use strict'

const Router = require('web/router');

class Site extends Router {

	actionIndex(){
		let ctx = this.ctx;
		let next = this.next;
		ctx.response.body = {message: 'Hello World'}
		next();
	}
}

module.exports = Site;