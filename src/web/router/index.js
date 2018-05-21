'use strict'

const routers = require('./routers');
const NotFoundError = require('../error/NotFoundError');

class Router {
	constructor(ctx, options){
		let request = ctx.request;
		let path = request.path.split('/');
		let requestRouter = [];
		let requestAction = [];
		this.ctx = ctx;
		this.options = options;
		if(path[1]){
			requestRouter = path[1].split(options.actionSeparator);
			requestRouter.forEach((value, index) => {
				requestRouter[index] = value.substring(0,1).toUpperCase() + value.substring(1);
			});
		}
		if(path[2]){
			requestAction = path[1].split(options.actionSeparator);
			requestAction.forEach((value, index) => {
				requestAction[index] = value.substring(0,1).toUpperCase() + value.substring(1);
			});
		}
		this.requestRouter = requestRouter.join('') || options.defaultRouter;
		this.requestAction = requestAction.join('') || options.defaultAction;
	}

	runAction(){
		let actionName = 'action' + this.requestAction.substring(0,1).toUpperCase() + this.requestAction.substring(1);
		if(routers[this.requestRouter]){
			let Router = new routers[this.requestRouter](this.ctx, this.options);
			if(typeof Router[actionName] == 'function'){
				return new Promise((resolve, revoke) => {
					Router.next = (error) => {
						if(error){
							this.ctx.error = error;
							resolve(error);
						}else{
							resolve();
						}
					}
					Router[actionName]();
				});
			}
		}
		this.ctx.error = new NotFoundError();
	}
}

module.exports = Router;