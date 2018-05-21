const AuthenticationError = require('../error/AuthenticationError');
const signatureObject = require('components/signature')();
const objectHelper = require('helpers/object');

module.exports = () => {
	var signature = {
		/**
		 * @var headerName
		 * 认证头部字段名称
		 * ---------------
		 * @author Verdient。
		 */
		headerName: 'Signature',

		/**
		 * @var key
		 * 签名密钥
		 * --------
		 * @author Verdient。
		 */
		key: '',

		/**
		 * @var routes
		 * 需要过滤的路由
		 * ------------
		 * @author Verdient。
		 */
		routes: {},

		/**
		 * @var message
		 * 错误提示信息
		 * ------------
		 * @author Verdient。
		 */
		message: 'Your request was made with invalid credentials.',

		/**
		 * @var code
		 * 错误码
		 * ---------
		 * @author Verdient。
		 */
		code: null,

		/**
		 * filter(Object ctx)
		 * 过滤函数
		 * ------------------
		 * @param {Object} ctx 上下文
		 * --------------------------
		 * @author Verdient。
		 */
		filter: (ctx, callback) => {
			let request = ctx.request;
			let router = ctx.router;
			let doFilter = false;
			if(typeof signature.routes == 'object' && typeof signature.routes[router.requestRouter] != 'undefined'){
				if(Array.isArray(signature.routes[router.requestRouter])  && objectHelper.inArray(router.requestAction, signature.routes[router.requestRouter])){
					doFilter = true;
				}else if(signature.routes[router.requestRouter] === '*'){
					doFilter = true;
				}
			}
			if(doFilter){
				signatureObject.key = signature.key;
				var doSignature = signatureObject.init();
				var requestSignature = request.getHeader(signature.headerName);
				if(!requestSignature){
					return callback(new AuthenticationError(signature.message, signature.code));
				}
				var signatureString = doSignature(request.body, request.getHeader('Signature-Method'));
				if(signatureString != requestSignature){
					return callback(new AuthenticationError(signature.message, signature.code));
				}
			}
			callback();
		}
	}

	return signature;
}