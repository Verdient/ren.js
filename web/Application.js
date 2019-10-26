'use strict';

const http = require('http');
const Component = require('../base/Component');
const Components = require('../base/Components');
const coreConfig = require('../base/config');
const Controllers = require('./Controllers');
const Filters = require('./Filters');
const RequestHandler = require('./handler/RequestHandler');
const objectHelper = require('../helpers/object');
const Validators = require('../base/Validators');

/**
 * defaultConfig
 * 默认配置
 * -------------
 * @author Verdient。
 */
const defaultConfig = {
	web: {
		host: '127.0.0.1',
		port: 80
	},
	timeout: 60000,
	errorHandler: {
		module: '../../web/handler/ErrorHandler',
		multiErrors: false
	}
}

/**
 * Application
 * 应用
 * -----------
 * @author Verdient。
 */
class Application extends Component
{
	/**
	 * initCoreProperty()
	 * 初始化核心属性
	 * ------------------
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	initCoreProperty(){
		super.initCoreProperty();

		/**
		 * @constant EVENT_LISTEN
		 * 监听事件
		 * ----------------------
		 * @author Verdient。
		 */
		this.EVENT_LISTEN = 'listen';

		/**
		 * @constant EVENT_REQUEST
		 * 请求事件
		 * -----------------------
		 * @author Verdient。
		 */
		this.EVENT_REQUEST = 'request';

		/**
		 * @constant EVENT_ERROR
		 * 错误事件
		 * ----------------------
		 * @author Verdient。
		 */
		this.EVENT_ERROR = 'error';

		return this;
	}

	/**
	 * initProperty()
	 * 初始化属性
	 * --------------
	 * @inheritdoc
	 * -----------
	 * @return {Object}
	 * @author Verdient。
	 */
	initProperty(){
		super.initProperty();

		/**
		 * @var config
		 * 配置信息
		 * -----------
		 * @author Verdient。
		 */
		this.config = {};

		/**
		 * @var requestHandler
		 * 请求处理器
		 * -------------------
		 * @author Verdient。
		 */
		this.requestHandler = null;

		return this;
	}

	/**
	 * init()
	 * 初始化
	 * -----
	 * @inheritdoc
	 * -----------
	 * @return {Self}
	 * @author Verdient。
	 */
	init(){
		this.config = objectHelper.merge(coreConfig, defaultConfig, this.options);
		this.validateConfig(this.config);
		Components.register(this.config.components);
		Validators.register(this.config.validators);
		Filters.register(this.config.filters);
		Controllers.register();
		this.requestHandler = new RequestHandler(this.config);
		return super.init();
	}

	/**
	 * events()
	 * 事件设置
	 * --------
	 * @inheritdoc
	 * -----------
	 * @return {Object}
	 * @author Verdient。
	 */
	events(){
		return {
			[this.EVENT_LISTEN]: (host, port) => {
				this.info('Application listen on ' + host + ':' + port + ' succeed');
			},
			[this.EVENT_ERROR]: (error) => {
				this.error(error);
			},
			[this.EVENT_REQUEST]: (request, response) => {
				this.trace(request.method + ' ' + request.url);
			}
		}
	}

	/**
	 * run()
	 * 运行
	 * -----
	 * @author Verdient。
	 */
	run(){
		this.listen({
			host: this.config.web.host,
			port: this.config.web.port,
			timeout: this.config.web.timeout
		});
	}

	/**
	 * validateConfig(Object)
	 * 校验配置
	 * ----------------------
	 * @param {Object} config 配置
	 * ---------------------------
	 * @author Verdient。
	 */
	validateConfig(config){
		let web = config.web;
		if(isNaN(web.port) || web.port < 0 || web.port > 65535){
			throw new Error('Application listen port must be an effective port number');
		}
	}

	/**
	 * listen(Object options)
	 * 监听
	 * ----------------------
	 * @param {Object} options 参数
	 * ----------------------------
	 * @author Verdient。
	 */
	listen(options){
		const server = http.createServer();
		server.on('request', (request, response) => {
			this.handleRequest(request, response);
			this.trigger(this.EVENT_REQUEST, request, response);
		});
		server.on('error', (error) => {
			this.trigger(this.EVENT_ERROR, error);
		});
		server.setTimeout(options.timeout);
		delete options.timeout;
		server.listen(options, () => {
			this.trigger(this.EVENT_LISTEN, options.host, options.port);
		});
	}

	/**
	 * handleRequest(IncomingMessage request, ServerResponse response)
	 * 处理请求
	 * ---------------------------------------------------------------
	 * @param {IncomingMessage} request 请求对象
	 * @param {ServerResponse} response 处理对象
	 * -----------------------------------------
	 * @author Verdient。
	 */
	handleRequest(request, response){
		this.requestHandler.handle(request, response);
	}
}

module.exports = Application;