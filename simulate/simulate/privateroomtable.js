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
	this._rooms = new Map();
	this._key = 0;
}

/**
 * Get the private room id using auto ascending strategy.
 *
 * Examples:
 *
 *   this.._autoAscendStrategy('Steve Jobs', 'Wozniak');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {Number} for room_id
 * @api protected
 */
Table.prototype._autoAscendStrategy = function(username1, username2) {
	const old_key = this._key;
	this._key += 1;
	return old_key;
};

/**
 * Create the private room of `username1` and `username2`.
 *
 * number of messages is less than 20.
 *
 * Examples:
 *
 *   table.createPrivateRoom('Steve Jobs', 'Wozniak');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.createPrivateRoom = async function(username1, username2) {
	await delay();
	if (!this._rooms.has(username1)) {
		this._rooms.set(username1, new Map());
	}
	if (!this._rooms.has(username2)) {
		this._rooms.set(username2, new Map());
	}
	const user1_private_rooms = this._rooms.get(username1);
	if (user1_private_rooms.has(username2)) {
		return false;
	}

	const room = this._autoAscendStrategy(username1, username2);
	user1_private_rooms.set(username2, room);
	const user2_private_rooms = this._rooms.get(username2);
	user2_private_rooms.set(username1, room);
	return true;
};

/**
 * Get the private rooms of `username1`.
 *
 * Examples:
 *
 *   table.readPrivateRoomsByUsername('Steve Jobs');
 *
 * @param {String} username
 * @return {Map|NULL} for result
 * @api public
 */
Table.prototype.readPrivateRoomsByUsername = async function(username) {
	await delay();
	if (!this._rooms.has(username)) {
		return null;
	}
	return this._rooms.get(username);
};

/**
 * Get the private rooms of `username1` and `username2`.
 *
 * Examples:
 *
 *   table.readPrivateRoomsByUsername1AndUsername2('Steve Jobs', 'Tim Cook');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {room_id|NULL} for result
 * @api public
 */
Table.prototype.readPrivateRoomsByUsername1AndUsername2 = async function(username1, username2) {
	await delay();
	if (!this._rooms.has(username1)) {
		return null;
	}
	const rooms = this._rooms.get(username1);
	if (!rooms.has(username2)) {
		return null;
	}
	return rooms.get(username2);
};

/**
 * Expose `Table`
 */
module.exports = Table;
