'use strict'

const fs = require('fs');
const path = require('path');
const BaseClass = require('base/BaseClass');
const NotFoundError = require('web/error/NotFoundError');

class Routers extends BaseClass {

	constructor(options){
		super();
		this.routers = {};
		this.routerSeparator = options.routerSeparator;
		this.actionSeparator = options.actionSeparator;
		this.defaultRouter = options.defaultRouter;
		this.defaultAction = options.defaultAction;
		this.register();
	}

	register(){
		let realPath = fs.realpathSync('routers');
		let files = fs.readdirSync('routers');
		files.forEach((value, index) => {
			files[index] = path.join(realPath, value);
		});
		files.forEach((file) => {
			var routerName = path.basename(file, '.js');
			this.routers[routerName] = require(file);
		});
	}

	run(ctx){
		let routers = this.routers;
		let router = this.getRequestRouter(ctx);
		let action = this.getRequestAction(ctx);
		let actionName = 'action' + action.substring(0,1).toUpperCase() + action.substring(1);
		if(routers[router]){
			let Router = new routers[router](ctx);
			if(typeof Router[actionName] == 'function'){
				return new Promise((resolve, revoke) => {
					Router.next = (error) => {
						if(error){
							ctx.error = error;
							resolve(error);
						}else{
							resolve();
						}
					}
					Router[actionName]();
				});
			}
		}
		ctx.error = new NotFoundError();
	}

	getRequestRouter(ctx){
		let request = ctx.request;
		let path = request.path.split('/');
		let requestRouter = [];
		if(path[1]){
			requestRouter = path[1].split(this.routerSeparator);
			requestRouter.forEach((value, index) => {
				requestRouter[index] = value.substring(0,1).toUpperCase() + value.substring(1);
			});
		}
		return requestRouter.join('') || this.defaultRouter;
	}

	getRequestAction(ctx){
		let request = ctx.request;
		let path = request.path.split('/');
		let requestAction = [];
		if(path[2]){
			requestAction = path[1].split(this.actionSeparator);
			requestAction.forEach((value, index) => {
				requestAction[index] = value.substring(0,1).toUpperCase() + value.substring(1);
			});
		}
		return requestAction.join('') || this.defaultAction;
	}
}

module.exports = Routers;