'use strict';

module.exports = {
	launage: 'zh-CN',
	port: 3005,
	response: {
		RESTful: false
	},
	components: {
		redis: {
			module: 'components/Redis',
			host: '192.168.33.200',
			password: 'hehehehe'
		}
	},
	filters: {
		signature: {
			module: 'web/filters/Signature',
			key: '1234',
			// routers: {
			// 	site: ['index']
			// }
		}
	}
};