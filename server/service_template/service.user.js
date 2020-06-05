/**
 * Module dependencies
 */
// TODO: require `query`
const { SERVICE: { STATUS: STATUS }, REASON } = require('../constant');

/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

/**
 * Register the user with given `username`, `password` and `nickname`.
 *
 * Examples:
 *
 *   service.register('Steve Jobs', 'Apple', 'The father of Apple');
 *
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.register = async function(username, password, nickname) {
	// TODO: check username, password and nickname
	const is_valid_username = ...;  // 直接问泉发他的正则表达式是什么
	const is_valid_password = ...;  // 直接问泉发他的正则表达式是什么
	const is_valid_nickname = ...;  // 直接问泉发他的正则表达式是什么
	const is_valid = is_valid_username && is_valid_password && is_valid_nickname;

	// TODO: case: not vaild
	if (!is_valid) {
		let reason = 0;
		reason = reason | is_valid_username ? 0 : REASON.REGISTER.USERNAME_ERROR;
		reason = reason | is_valid_password ? 0 : REASON.REGISTER.PASSWORD_ERROR;
		reason = reason | is_valid_nickname ? 0 : REASON.REGISTER.NICKNAME_ERROR;
		return { status: STATUS.REJECT, reason: reason };
	}

	// TODO: create the user in DB

	// TODO: case fail
	return { status: STATUS.REJECT, reason: REASON.REGISTER.USER_DUPLICATE };
	// TODO: case succeed
	return { status: STATUS.OK };
};

/**
 * Validate the user with given `username` and `password`.
 *
 * Examples:
 *
 *   service.isValid('Steve Jobs', 'Apple');
 *
 * @param {String} username
 * @param {String} password
 * @return {Object{status}} for result
 * @api public
 */
Service.prototype.isValid = async function(username, password) {
	// TODO: query
	// 这里芊愉没有支持，不过给的query的login也可以曲折实现；或者叫芊愉改一下

	// TODO: case: no such user
	return { status: STATUS.NOT_FOUND };
	
	// TODO: case: right password
	return { status: STATUS.OK };

	// TODO: case: error password
	return { status: STATUS.REJECT };
};

/**
 * Get the information of the user with given `username`.
 *
 * Examples:
 *
 *   service.getInfo('Steve Jobs');
 *
 * @param {String} username
 * @param {String} password
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getInfo = async function(username) {
	// TODO: query only one user

	// TODO: case: no such user
	return { status: STATUS.NOT_FOUND };

	// TODO: case: succeed
	return { status: STATUS.OK, data: ... };
};

/**
 * Set the `password` of the user with given `username`.
 *
 * Examples:
 *
 *   service.setPassword('Steve Jobs', 'Apple');
 *
 * @param {String} username
 * @param {String} password
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.setPassword = async function(username, password) {
	// TODO: check password
	const is_valid = ...;  // 直接问泉发他的正则表达式是什么

	// TODO: case: not vaild
	if (!is_valid) {
		return { status: STATUS.REJECT, reason: REASON.USERINFO.PASSWORD_ERROR };
	}

	// TODO: update in DB

	// TODO: case: no such user
	return { status: STATUS.NOT_FOUND };

	// TODO: case: succeed
	return { status: STATUS.OK };
};

/**
 * Set the `photo` of the user with given `username`.
 *
 * Examples:
 *
 *   service.setPhoto('Steve Jobs', '...');
 *
 * @param {String} username
 * @param {String} photo
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.setNickname = async function(username, nickname) {
	// TODO: check nickname
	const is_valid = ...;  // 直接问泉发他的正则表达式是什么

	// TODO: case: not vaild
	if (!is_valid) {
		return { status: STATUS.REJECT, reason: REASON.USERINFO.NICKNAME_ERROR };
	}
	// TODO: update in DB

	// TODO: case: no such user
	return { status: STATUS.NOT_FOUND };

	// TODO: case: succeed
	return { status: STATUS.OK };
};

/**
 * Set the `photo` of the user with given `username`.
 *
 * Examples:
 *
 *   service.setPhoto('Steve Jobs', '...');
 *
 * @param {String} username
 * @param {String} photo
 * @return {Object{status}} for result
 * @api public
 */
Service.prototype.setPhoto = async function(username, photo) {
	// TODO: update in DB

	// TODO: case: no such user
	return { status: STATUS.NOT_FOUND };

	// TODO: case: succeed
	return { status: STATUS.OK };
};

/**
 * Expose `Service`
 */
module.exports = Service;
