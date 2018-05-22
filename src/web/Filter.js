'use strict'

const BaseClass = require('base/BaseClass');

const objectHelper = require('../helpers/object');

class Filter extends BaseClass {

	constructor(routers, message, code){
		super();
		this.routers = routers || false;
		this.message = message || 'Forbidden';
		this.code = code || false;
	}

	isNeed(ctx){
		let routers = ctx.routers;
		let router = routers.getRequestRouter(ctx);
		let action = routers.getRequestAction(ctx)
		if(this.routers){
			if(typeof this.routers == 'object' && typeof this.routers[router] != 'undefined'){
				let actions = this.routers[router];
				if(actions === '*'){
					return true;
				}else if(Array.isArray(actions) && objectHelper.inArray(action, actions)){
					return true;
				}
			}else if(this.routers === '*'){
				return true;
			}
		}
		return false;
	}
}

module.exports = Filter;