'use strict'

const BaseClass = require('base/BaseClass');

var doFilter = async (filter, ctx) => {
	return new Promise((resolve, revoke) => {
		filter.filter(ctx, (error) => {
			if(error){
				resolve(error);
			}else{
				resolve();
			}
		});
	});
}

class Filters extends BaseClass {

	constructor(options){
		super();
		this.filters = {};
		if(typeof options == 'object'){
			this.register(options);
		}
	}

	register(options){
		for(var i in options){
			if(typeof options[i] == 'string'){
				this.filters[i] = new require(config[i])();
			}else{
				if(typeof options[i].module == 'undefined'){
					throw new Error('filters module must be set');
				}
				let Filter = require(options[i].module);
				this.filters[i] = new Filter(options[i]);
			}
		}
	}

	async run(ctx){
		let error;
		let Filter;
		for(var i in this.filters){
			Filter = this.filters[i];
			if(Filter.isNeed(ctx)){
				error = await doFilter(Filter, ctx);
				if(error){
					ctx.error = error;
					return false;
				}
			}
		}
		return true;
	}
}

module.exports = Filters;