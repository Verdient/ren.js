'use strict'

const Router = require('web/router');

class Site extends Router {

	actionIndex(){
		let ctx = this.ctx;
		let next = this.next;
		next(new Error('sae'));
		setTimeout(() => {
			ctx.response.body = {message: 'Hello World'}
			next();
		}, 500);
	}
}

module.exports = Site;