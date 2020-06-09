/**
 * Module dependencies
 */
const db = require('./db.singleton');
const { SERVICE: { STATUS: STATUS }, REASON } = require('../constant');
const nlp = require('../nlp/nlp.singleton');

/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

Service.prototype.getRecentChatList = async function(username) {
	const rooms_map = await db.privaterooms.readPrivateRoomsByUsername(username);
	if (rooms_map === null) {
		return { status: STATUS.NOT_FOUND };
	}
	let rooms = [];
	for (let room of [...rooms_map]) {
		const room_id = room[1];
		const unread_cnt = await db.privatemessages.readUnreadCountByRoom(room_id);
		if (unread_cnt === null) {
			continue;
		}
		const last_message = await db.privatemessages.readLastPrivateMessageByRoom(room_id);
		const { text: last_text, time: last_time, sender } = last_message;
		modify_last_text = await nlp.textfilter(last_text);
		rooms.push({ friend: room[0], last_text: modify_last_text, last_time, unread_cnt, sender });
	}
	const rooms_sort = rooms.sort((room1, room2) => {
		return room2.last_time - room1.last_time;
	});

	if (rooms_sort.length === 0) {
		return { status: STATUS.NOT_FOUND };
	}

	return { status: STATUS.OK, data: rooms_sort };
};

/**
 * Get the Messages before `time` in `room`.
 *
 * number of messages is less than 20.
 *
 * Examples:
 *
 *   service.getMessages('...');
 *
 * @param {*} username1
 * @param {*} username2
 * @param {*} time
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getMessages = async function(username1, username2, time) {
	if (username1 == username2) {
		return { status: STATUS.REJECT, reason: REASON.GET_HISTORY.SAME_USER };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(username1, username2);
	if (room === null) {
		return { status: STATUS.REJECT, reason: REASON.GET_HISTORY.NOT_FRIENDS };
	}
	let result = await db.privatemessages.readPrivateMessagesByRoomAndTime(room, time);
	if (result === null) {
		return { status: STATUS.OK, data: [] };
	}
	for (let message of result) {
		message.sentiment = await nlp.sentiment(message.text);
		message.text = await nlp.textfilter(message.text);
	}
	return { status: STATUS.OK, data: result };
};

/**
 * Get the Messages before `time` in `room`.
 *
 * number of messages is less than 20.
 *
 * Examples:
 *
 *   service.getMessages('...');
 *
 * @param {*} username1
 * @param {*} username2
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.addMessage = async function(message) {
	const { sender, receiver, text, time } = message;
	if (sender == receiver) {
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.SAME_USER };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(sender, receiver);
	if (room === null) {
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.NOT_FRIENDS };
	}
	const modify_message = { room, sender, text, time };
	await db.privatemessages.createPrivateMessage(modify_message);
	const sentiment = await nlp.sentiment(text);
	const modify_text = await nlp.textfilter(text);
	return { status: STATUS.OK, data: { text: modify_text, sentiment } };
};

Service.prototype.readMessage = async function(sender, receiver) {
	if (sender === receiver) {
		return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.SAME_USER };
	}
	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(sender, receiver);
	if (room === null) {
		return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NOT_FRIENDS};
	}
	const result = await db.privatemessages.updateIsReadBySenderAndRoom(sender, room);
	if (!result) {
		return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NO_UPDATE};
	}
	return { status: STATUS.OK }
};

/**
 * Expose `Service`
 */
module.exports = Service;
