/**
 * Module dependencies
 */
const { randDelay } = require('../util');
const { SIMULATE } = require('../constant');

const delay = () => randDelay(SIMULATE.MAX_DELAY);


/**
 * `Table` constructor
 *
 * @api public
 */
function Table() {
	this._users = new Map();
}

/**
 * Create a new user with given `username`, `password`, `nickname`.
 *
 * Examples:
 *
 *   table.createUser('Steve Jobs', 'Apple', 'The father of Apple');
 *
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.createUser = async function(username, password, nickname) {
	await delay();
	if (!this._users.has(username)) {
		this._users.set(username, { username, password, nickname, photo: '' });
		return true;
	}
	return false;
};

/**
 * Get all the infomation of the user identified by `username`.
 *
 * Examples:
 *
 *   table.readUserByUsername('Steve Jobs');
 *
 * @param {String} username
 * @return {Object|NULL} for result
 * @api public
 */
Table.prototype.readUserByUsername = async function(username) {
	await delay();
	const user = this._users.get(username);
	if (user) {
		const { username, nickname, photo } = user;
		return { username, nickname, photo };
	}
	return null;
};

/**
 * Get the password of the user identified by `username``.
 *
 * Examples:
 *
 *   table.readPasswordByUsername('Steve Jobs');
 *
 * @param {String} username
 * @return {String|NULL} for result
 * @api public
 */
Table.prototype.readPasswordByUsername = async function(username) {
	await delay();
	const user = this._users.get(username);
	if (user) {
		return user.password;
	}
	return null;
};

/**
 * Set the `password` of the user identified by `username`.
 *
 * Examples:
 *
 *   table.updatePasswordByUsername('Steve Jobs', 'Apple');
 *
 * @param {String} username
 * @param {String} password
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.updatePasswordByUsername = async function(username, password) {
	await delay();
	const user = this._users.get(username);
	if (user) {
		user.password = password;
		this._users.set(username, user);
		return true;
	}
	return false;
};

/**
 * Set the `nickname` of the user identified by `username`.
 *
 * Examples:
 *
 *   table.updateNicknameByUsername('Steve Jobs', 'The father of Apple');
 *
 * @param {String} username
 * @param {String} nickname
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.updateNicknameByUsername = async function(username, nickname) {
	await delay();
	const user = this._users.get(username);
	if (user) {
		user.nickname = nickname;
		this._users.set(username, user);
		return true;
	}
	return false;
};

/**
 * Set the `photo` of the user identified by `username`.
 *
 * Examples:
 *
 *   table.updatePhotoByUsername('Steve Jobs', '...');
 *
 * @param {String} username
 * @param {String} photo
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.updatePhotoByUsername = async function(username, photo) {
	await delay();
	const user = this._users.get(username);
	if (user) {
		user.photo = photo;
		this._users.set(username, user);
		return true;
	}
	return false;
};

/**
 * Expose `Table`
 */
module.exports = Table;
