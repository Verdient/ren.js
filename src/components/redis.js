'use strict';

const redis = require('redis');

module.exports = () => {
	var redisCompoent = {

		/**
		 * @var host
		 * 主机
		 * ---------
		 * @author Verdient。
		 */
		host: 'localhost',

		/**
		 * @var port
		 * 端口
		 * ---------
		 * @author Verdient。
		 */
		port: 6379,

		/**
		 * @var password
		 * 密码
		 * --------------
		 * @author Verdient。
		 */
		password: '',

		/**
		 * @var db
		 * 数据库
		 * -------
		 * @author Verdient。
		 */
		db: 0,

		/**
		 * init()
		 * 初始化
		 * ------
		 * @return {Object}
		 * @author Verdient。
		 */
		init: () => {
			var redisClient = redis.createClient({
				host: redisCompoent.host,
				port: redisCompoent.port,
				password: redisCompoent.password,
				db: redisCompoent.db
			});
			redisClient.enabled = redisCompoent.enabled;
			return redisClient;
		}
	}

	return redisCompoent;
};