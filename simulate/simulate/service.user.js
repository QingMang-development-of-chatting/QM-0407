/**
 * Module dependencies
 */
const db = require('./db.singleton');
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
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.register = async function(username, password, nickname) {
	const result = await db.users.createUser(username, password, nickname);
	if (!result) {
		return { status: STATUS.REJECT, reason: REASON.REGISTER.USER_DUPLICATE };
	}
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
	const result = await db.users.readPasswordByUsername(username);
	if (result === null) {
		return { status: STATUS.NOT_FOUND };
	}
	if (result === password) {
		return { status: STATUS.OK };
	}
	return { status: STATUS.REJECT }
};

/**
 * Get the information of the user with given `username`.
 *
 * Examples:
 *
 *   service.getInfo('Steve Jobs');
 *
 * @param {*} username
 * @param {*} password
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getInfo = async function(username) {
	let is_valid = typeof(username) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	const result = await db.users.readUserByUsername(username);
	if (result === null) {
		return { status: STATUS.NOT_FOUND };
	}
	return { status: STATUS.OK, data: result };
};

/**
 * Set the `password` of the user with given `username`.
 *
 * Examples:
 *
 *   service.setPassword('Steve Jobs', 'Apple');
 *
 * @param {*} username
 * @param {*} password
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.setPassword = async function(username, password) {
	let is_valid = typeof(username) === 'string';
	is_valid = is_valid && typeof(password) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	const result = await db.users.updatePasswordByUsername(username, password);
	if (!result) {
		return { status: STATUS.REJECT };
	}
	return { status: STATUS.OK };
};

/**
 * Set the `photo` of the user with given `username`.
 *
 * Examples:
 *
 *   service.setPhoto('Steve Jobs', '...');
 *
 * @param {*} username
 * @param {*} photo
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.setNickname = async function(username, nickname) {
	let is_valid = typeof(username) === 'string';
	is_valid = is_valid && typeof(nickname) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	const result = await db.users.updateNicknameByUsername(username, nickname);
	if (!result) {
		return { status: STATUS.REJECT };
	}
	return { status: STATUS.OK };
};

/**
 * Set the `photo` of the user with given `username`.
 *
 * Examples:
 *
 *   service.setPhoto('Steve Jobs', '...');
 *
 * @param {*} username
 * @param {*} photo
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.setPhoto = async function(username, photo) {
	let is_valid = typeof(username) === 'string';
	is_valid = is_valid && typeof(photo) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	const result = await db.users.updatePhotoByUsername(username, photo);
	if (!result) {
		return { status: STATUS.REJECT };
	}
	return { status: STATUS.OK };
};

/**
 * Expose `Service`
 */
module.exports = Service;
