'use strict'

const Router = require('../../src/web/router');

class Site extends Router {

	actionIndex(){
		this.ctx.response.body = {message: 'Hello World'}
		this.resolve();
	}
}

module.exports = Site;