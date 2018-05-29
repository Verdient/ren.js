/**
 * number(Integer min, Integer max)
 * 生成随机码
 * --------------------------------
 * @param Integer min 最小值
 * @param Integer max 最大值
 * -------------------------
 * @return Integer
 * @author Verdient。
 */
var number = function(min, max) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * min + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (max - min + 1) + min, 10);
			break;
		default:
			return 0;
			break;
	}
}

/**
 * string(Integer length)
 * 生成随机字符串
 * ----------------------
 * @param Integer length 长度
 * --------------------------
 * @return Integer
 * @author Verdient。
 */
var string = (length) => {
	length = length || 32;
	var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	var maxPos = $chars.length;
	var string = '';
	for(i = 0; i < length; i++){
		string += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return string;
}

module.exports = {
	number: number,
	string: string
};