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
	this._friends = new Map();
}

/**
 * Make `username1` and `username2` be friends.
 *
 * Examples:
 *
 *   table.createFriends('Steve Jobs', 'Wozniak');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.createFriends = async function(username1, username2) {
	await delay();
	if (!this._friends.has(username1)) {
		this._friends.set(username1, new Set());
	}
	const friendsSet1 = this._friends.get(username1);
	if (friendsSet1.has(username2)) {
		return false;
	}
	friendsSet1.add(username2);

	if (!this._friends.has(username2)) {
		this._friends.set(username2, new Set());
	}
	const friendsSet2 = this._friends.get(username2);
	friendsSet2.add(username1);

	return true;
};

/**
 * Get the friends of `username`.
 *
 * Examples:
 *
 *   table.readFriendsByUsername('Steve Jobs');
 *
 * @param {String} username
 * @return {Set|NULL} for result
 * @api public
 */
Table.prototype.readFriendsByUsername = async function(username) {
	await delay();
	if (this._friends.has(username)) {
		return this._friends.get(username);
	}
	return null;
};

/**
 * Depart the friendship of `username1` and `username2`.
 *
 * Examples:
 *
 *   table.deleteFriendsByUsernames('Steve Jobs', 'Wozniak');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.deleteFriendsByUsernames = async function(username1, username2) {
	await delay();
	if (!this._friends.has(username1)) {
		return false;
	}
	const friendsSet1 = this._friends.get(username1);
	if (!friendsSet1.has(username2)) {
		return false;
	}
	friendsSet1.delete(username2);

	const friendsSet2 = this._friends.get(username2);
	friendsSet2.delete(username1);

	return true;
};

/**
 * Expose `Table`
 */
module.exports = Table;
