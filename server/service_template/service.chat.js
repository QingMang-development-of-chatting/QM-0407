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
 * Get the chatlist.
 *
 * Examples:
 *
 *   service.getRecentChatList('...');
 *
 * @param {String} username
 * @return {Object{status, data}} for result
 * @api public
 */
Service.prototype.getRecentChatList = async function(username) {
	const rooms_map = await db.privaterooms.readPrivateRoomsByUsername(username);
	// TODO: query DB. Expect the last message of rooms the user `username` in.

	// TODO: case: empty
	return { status: STATUS.NOT_FOUND };

	// TODO: case: not empty
	// TODO: convert the result of query to
	// [{ friend(String), last_text(String), last_time(Number), unread_cnt(Number), sender(String) }](Array)
	// friend is the username of friend,
	// last_text is the text of last message,
	// last_time is the timestamp of last message,
	// unread_cnt is the number of unread messages in the room, either you or your friend,
	// sender is the sender of last message.

	// TODO: 对数组按时间last_time递减排序

	// TODO: case: OK
	return { status: STATUS.OK, data: ... };
};

/**
 * Get the Messages before `time` in `room`.
 *
 * number of messages is no greater than 20.
 *
 * Examples:
 *
 *   service.getMessages('...');
 *
 * @param {String} username1
 * @param {String} username2
 * @param {Number} time
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getMessages = async function(username1, username2, time) {
	if (username1 === username2) {
		return { status: STATUS.REJECT, reason: REASON.GET_HISTORY.SAME_USER };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(username1, username2);
	// TODO: query DB.

	// TODO: case: they are not friends
	return { status: STATUS.REJECT, reason: REASON.GET_HISTORY.NOT_FRIENDS };

	// TODO: case: ok, the result is empty
	return { status: STATUS.OK, data: [] };

	// TODO: case: ok, the result is not empty
	// TODO: convert the query result to
	// [{sender(String), text(String), time(Number), is_read(Boolean)}](Array)
	// is_read is that the message is read by the receiver?
	// Array.length should be no greater than 20
	return { status: STATUS.OK, data: ... };
};

/**
 * Add the Messages to the room.
 *
 * number of messages is less than 20.
 *
 * Examples:
 *
 *   service.addMessage('...');
 *
 * @param {Object} message
 * @param {String} message.sender
 * @param {String} message.receiver
 * @param {String} message.text
 * @param {Number} message.time
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.addMessage = async function(message) {
	const { sender, receiver, text, time } = message;
	if (sender === receiver) {
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.SAME_USER };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(sender, receiver);
	// TODO: query DB. Get the room of sender & receiver
	const room = ...

	// TODO: case: no such room
	return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.NOT_FRIENDS };

	// TODO: query DB. insert the message to room.

	// TODO: case: OK.
	return { status: STATUS.OK };
};

/**
 * Set the state of a bundle of messages read.
 *
 * Examples:
 *
 *   service.addMessage('...');
 *
 * @param {String} sender
 * @param {String} receiver
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.readMessage = async function(sender, receiver) {
	if (sender === receiver) {
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.SAME_USER };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(sender, receiver);
	// TODO: quert DB. Get the room of sender & receiver.
	const room = ...

	// TODO: case: no such room
	return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NOT_FRIENDS};

	// TODO: query DB. Set the state of message read.

	// TODO: case: no messages update
	return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NO_UPDATE};

	// TODO: case: OK
	return { status: STATUS.OK }
};

/**
 * Expose `Service`
 */
module.exports = Service;
