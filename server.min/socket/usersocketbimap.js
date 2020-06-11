/**
 * Module dependencies
 */
const { BiMap } = require('../util');

/**
 * `UserSocketBiMap` constructor
 *
 * @api public
 */
function UserSocketBiMap() {
	this._bimap = new BiMap();
}

/**
 * Bind `username` and `socket_id`.
 * 
 * Examples:
 *
 *   user_socket_bimap.bindUserSocket('...', '#...');
 *
 * @param {String} username
 * @param {String} socket_id
 * @api public
 */
UserSocketBiMap.prototype.bindUserSocket = function(username, socket_id) {
	this._bimap.regular.set(username, socket_id);
};

/**
 * Depart the `username` and `socket_id`.
 * 
 * Examples:
 *
 *   user_socket_bimap.departUserSocketBySocket(#...');
 *
 * @param {String} socket_id
 * @return {Boolean} succeed or fail
 * @api public
 */
UserSocketBiMap.prototype.departUserSocketBySocket = function(socket_id) {
	return this._bimap.inverse.delete(socket_id);
};

/**
 * Get `socket_id` by `username`.
 * 
 * Examples:
 *
 *   user_socket_bimap.getSocketByUser('...');
 *
 * @param {String} username
 * @return {String} for socket_id
 * @api public
 */
UserSocketBiMap.prototype.getSocketByUser = function(username) {
	return this._bimap.regular.get(username);
};

/**
 * Get `username` by `socket_id`.
 * 
 * Examples:
 *
 *   user_socket_bimap.getUserBySocket('...');
 *
 * @param {String} socket_id
 * @return {String} for username
 * @api public
 */
UserSocketBiMap.prototype.getUserBySocket = function(socket_id) {
	return this._bimap.inverse.get(socket_id);
};

/**
 * Expose `UserSocketBiMap`
 */
module.exports = UserSocketBiMap;
