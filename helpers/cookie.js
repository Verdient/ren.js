'use strict'

/**
 * parseCookie(String cookie)
 * 解析Cookie
 * --------------------------
 * @param {String} cookie Cookie 字符串
 * -----------------------------------
 * @return {Object}
 * @author Verdient。
 */
let parseCookie = (cookie) => {
	let result = {
		httpOnly: false
	};
	cookie = cookie.split('; ');
	let keyValue = cookie[0].split('=');
	delete cookie[0];
	result.key = keyValue[0];
	result.value = keyValue[1];
	cookie.forEach(element => {
		if(element.toLocaleLowerCase() === 'httponly'){
			result.httpOnly = true;
		}else{
			element = element.split('=');
			result[element[0].toLocaleLowerCase()] = element[1];
		}
	});
	return result;
}

/**
 * parseCookies(String cookie)
 * 批量解析Cookie
 * ---------------------------
 * @param {String} cookie Cookie 字符串
 * -----------------------------------
 * @return {Object}
 * @author Verdient。
 */
let parseCookies = (cookies) => {
	let result = [];
	if(Array.isArray(cookies)){
		cookies.forEach(cookie => {
			result.push(parseCookie(cookie));
		});
	}
	return result;
}

/**
 * buildCookie(Object cookie)
 * 构建Cookie
 * --------------------------
 * @param {Object} cookie Cookie
 * -----------------------------
 * @return {String}
 * @author Verdient。
 */
let buildCookie = (cookie) => {
	return cookie.key + '=' + cookie.value;
}

/**
 * buildCookies(Array cookies)
 * 批量构建Cookie
 * ---------------------------
 * @param {Array} cookies Cookie 集合
 * ---------------------------------
 * @return {String}
 * @author Verdient。
 */
let buildCookies = (cookies) => {
	let result = '';
	cookies.forEach(cookie => {
		result += buildCookie(cookie) + '; ';
	});
	return result.substr(0, result.length - 2);
}

module.exports = {
	parseCookie,
	parseCookies,
	buildCookie,
	buildCookies
}