'use strict';

module.exports = {
	launage: 'zh-CN',
	port: 3005,
	response: {
		RESTful: false
	},
	logger: {
		level: 3,
		targets: {
			system: {
				levels: []
			}
		}
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