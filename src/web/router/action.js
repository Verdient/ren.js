'use strict'

const routers = require('./routers');
const NotFoundError = require('../Error/NotFoundError');

module.exports = async (ctx, options) => {
	let router = ctx.request.router;
	let action = ctx.request.action;
	if(router == '/'){
		router = options.defaultRouter;
	}
	if(action == '/'){
		action = options.defaultAction;
	}
	action = action.split(options.actionSeparator);
	action.forEach((value, index) => {
		action[index] = value.substring(0,1).toUpperCase() + value.substring(1);
	});
	let actionName = 'action' + action.join('');
	if(routers[router]){
		let Router = new routers[router](ctx);
		if(typeof Router[actionName] == 'function'){
			return new Promise((resolve, revoke) => {
				Router.resolve = resolve;
				Router.revoke = revoke;
				Router[actionName]();
			});
		}
	}
	ctx.error = new NotFoundError();
}