const filters = require('./index');

var doFilter = async (filter, ctx) => {
	return new Promise((resolve, revoke) => {
		filter(ctx, (error) => {
			if(error){
				resolve(error);
			}else{
				resolve();
			}
		});
	});
}

module.exports = async (ctx) => {
	let filtersFunction = [];
	let result;
	for(var i in filters){
		result = await doFilter(filters[i].filter, ctx);
		if(!result){
			return true;
		}else{
			ctx.error = result;
			return false;
		}
	}
}