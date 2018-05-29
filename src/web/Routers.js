'use strict'

const fs = require('fs');
const path = require('path');
const BaseClass = require('../base/BaseClass');
const Errors = require('../base/Errors');
const NotFoundError = require('../web/errors/NotFoundError');

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
			routerName = routerName.substring(0,1).toLowerCase() + routerName.substring(1)
			this.routers[routerName] = require(file);
		});
	}

	async run(ctx){
		let routers = this.routers;
		let router = this.getRequestRouter(ctx);
		let action = this.getRequestAction(ctx);
		let actionName = 'action' + action.substring(0,1).toUpperCase() + action.substring(1);
		if(routers[router]){
			let Router = new routers[router](ctx);
			if(typeof Router[actionName] == 'function'){
				return new Promise((resolve, revoke) => {
					Router.next = (result) => {
						if(result){
							if(result instanceof Error){
								ctx.error = result;
								return resolve(false);
							}
							if(result instanceof Errors){
								ctx.error = result;
								return resolve(false);
							}
							ctx.response.body = {data: result};
						}
						resolve(true);
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
			path[1] = path[1].toLowerCase();
			requestRouter = path[1].split(this.routerSeparator);
			requestRouter.forEach((value, index) => {
				if(index){
					requestRouter[index] = value.substring(0,1).toUpperCase() + value.substring(1);
				}else{
					requestRouter[index] = value;
				}
			});
		}
		return requestRouter.join('') || this.defaultRouter;
	}

	getRequestAction(ctx){
		let request = ctx.request;
		let path = request.path.split('/');
		let requestAction = [];
		if(path[2]){
			path[2] = path[2].toLowerCase();
			requestAction = path[2].split(this.actionSeparator);
			requestAction.forEach((value, index) => {
				if(index){
					requestAction[index] = value.substring(0,1).toUpperCase() + value.substring(1);
				}else{
					requestAction[index] = value;
				}
			});
		}
		return requestAction.join('') || this.defaultAction;
	}
}

module.exports = Routers;