'use strict';

module.exports = {
	launage: 'zh-CN',
	port: 3005,
	components: {
		redis: {
			module: 'components/redis',
			host: '192.168.33.200',
			password: 'hehehehe'
		}
	},
	filters: {
		signature: {
			module: 'web/filters/signature',
			key: '1234',
			// routes: {
			// 	site: ['index']
			// }
		}
	}
};