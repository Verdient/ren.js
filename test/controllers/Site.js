'use strict'

const Controller = require('web/Controller');

class Site extends Controller
{
	actionIndex(){
		this.next('Hello world');
	}
}

module.exports = Site;
