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
}

/**
 * Create the private `message`.
 *
 * Examples:
 *
 *   table.createPrivateMessage({
 *     room: '...', sender: '...', text: '...'
 *   });
 *
 * @param {Object} message
 * @param {String} message.room
 * @param {String} message.sender
 * @param {String} message.text
 * @param {Number} message.time
 * @return {True} always succeed
 * @api public
 */
Table.prototype.createPrivateMessage = async function(message) {
	await delay();
	const { room, sender, text, time } = message;
	if (!this._rooms.has(room)) {
		this._rooms.set(room, []);
	}
	const _room = this._rooms.get(room);
	const modify_message = { sender, text, time, is_read: false };
	_room.push(modify_message);

	return true;
};

/**
 * Get the Messages before `time` in `room`.
 *
 * number of messages is less than 20.
 *
 * Examples:
 *
 *   table.readPrivateMessagesByRoomAndTime('...');
 *
 * @param {String} room
 * @param {Number} time
 * @return {Array|NULL} for result
 * @api public
 */
Table.prototype.readPrivateMessagesByRoomAndTime = async function(room, time) {
	await delay();
	if (!this._rooms.has(room)) {
		return null;
	}
	const messages = this._rooms.get(room);
	const messagesBeforeTime = messages.filter(elem => {
		return elem.time < time;
	});
	const messagesSort = messagesBeforeTime.sort((o1, o2) => {
		return o1.time - o2.time;
	});

	return messagesSort.slice(-21);
};

/**
 * Get the number of the un_read chat in `room`.
 *
 * Examples:
 *
 *   table.readTimeByRoom('...');
 *
 * @param {String} room
 * @return {Number|NULL} for result
 * @api public
 */
Table.prototype.readUnreadCountByRoom = async function(room) {
	await delay();
	if (!this._rooms.has(room)) {
		return null;
	}
	const messages_unread = this._rooms.get(room).filter(message => {
		return message.is_read === false
	});
	return messages_unread.length;
};

/**
 * Get the last message in `room`.
 *
 * Examples:
 *
 *   table.readLastPrivateMessageByRoom('...');
 *
 * @param {String} room
 * @return {Object|NULL} for result
 * @api public
 */
Table.prototype.readLastPrivateMessageByRoom = async function(room) {
	await delay();
	if (!this._rooms.has(room)) {
		return null;
	}
	const last_messages = this._rooms.get(room).slice(-1)[0];
	return last_messages;
};

/**
 * Set the messages' identified by `sender` and `room` is_read field true.
 *
 * number of messages is less than 20.
 *
 * Examples:
 *
 *   table.updateIsReadBySenderAndRoom('...', '...');
 *
 * @param {String} room
 * @param {String} sender
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.updateIsReadBySenderAndRoom = async function(sender, room) {
	await delay();
	if (!this._rooms.has(room)) {
		return false;
	}
	const _room = this._rooms.get(room);
	let is_modified = false;
	
	const modify_room = _room.map(message => {
		if (message.sender === sender && message.is_read === false) {
			message.is_read = true;
			is_modified = true;
		}
		return message;
	});
	if (!is_modified) {
		return false;
	}
	this._rooms.set(room, modify_room);
	return true;
};

/**
 * Expose `Table`
 */
module.exports = Table;
