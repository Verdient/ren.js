const crypto = require('crypto');
const objectHelper = require('helpers/object');

module.exports = () => {

	/**
	 * prepareContent(Object content)
	 * 准备消息体
	 * ------------------------------
	 * @param {Object} content 消息体
	 * -----------------------------
	 * @return Object
	 * @author Verdient。
	 */
	var prepareContent = function(content){
		objectHelper.ksort(content);
		return content;
	}

	/**
	 * calculateContentMd5(Object content)
	 * 计算消息体MD5
	 * -----------------------------------
	 * @param {Object} content 消息体
	 * -----------------------------
	 * @return String
	 * @author Verdient。
	 */
	var calculateContentMd5 = (content) => {
		content = prepareContent(content);
		if(!content || objectHelper.isEmptyObject(content)){
			return '';
		}
		var md5 = crypto.createHash('md5');
		return md5.update(JSON.stringify(content)).digest('hex').toLocaleLowerCase();
	}

	/**
	 * buildSignatureString(Object content)
	 * 构建签名字符串
	 * ------------------------------------
	 * @param {Object} content 消息体
	 * -----------------------------
	 * @return String
	 * @author Verdient。
	 */
	var buildSignatureString = (content, signatureMethod, key) => {
		var contentMd5 = calculateContentMd5(content);
		return (contentMd5 || '' ) + (signatureMethod || '') + key;
	}

	var signature = {
		key: null,

		init: () => {
			return (content, signatureMethod) => {
				try{
					var signatureString = buildSignatureString(content, signatureMethod, signature.key);
					var hash = crypto.createHmac(signatureMethod, signature.key);
					var md5 = crypto.createHash('md5');
					return md5.update(hash.update(signatureString).digest('hex').toLocaleLowerCase()).digest('hex').toLocaleLowerCase();
				}catch(e){
					return false;
				}
			}
		}
	}

	return signature;
}