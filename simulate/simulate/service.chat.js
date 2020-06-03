/**
 * Module dependencies
 */
const db = require('./db.singleton');
const { SERVICE: { STATUS: STATUS } } = require('../constant');

/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

Service.prototype.getRecentChatList = async function(username) {
	let is_valid = typeof(username) === 'string';
	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}

	const rooms_map = await db.privaterooms.readPrivateRoomsByUsername(username);
	if (rooms_map === null) {
		return { status: STATUS.OK, data: [] };
	}
	let rooms = [];
	for (let room of [...rooms_map]) {
		const room_id = room[1];
		const last_time = await db.privatemessages.readTimeByRoom(room_id);
		const unread_cnt = await db.privatemessages.readUnreadCountByRoom(room_id);
		const sender = await db.privatemessages.readLastSendertByRoom(room_id);
		rooms.push({ friend: room[0], last_time, unread_cnt, sender });
	}
	const rooms_sort = rooms.sort((room1, room2) => {
		return room2.last_time - room1.last_time;
	});

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
	let is_valid = typeof(username1) === 'string';
	is_valid = is_valid && typeof(username2) === 'string';
	is_valid = is_valid && typeof(time) === 'number';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	if (username1 == username2) {
		return { status: STATUS.REJECT, reason: 'same user' };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(username1, username2);
	if (room === null) {
		return { status: STATUS.REJECT, reason: 'may not friends' };
	}
	let result = await db.privatemessages.readPrivateMessagesByRoomAndTime(room, time);
	if (result === null) {
		return { status: STATUS.OK, data: [] };
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

	let is_valid = typeof(sender) === 'string';
	is_valid = is_valid && typeof(receiver) === 'string';
	is_valid = is_valid && typeof(text) === 'string';
	is_valid = is_valid && typeof(time) === 'number';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	if (sender == receiver) {
		return { status: STATUS.REJECT, reason: 'same user' };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(sender, receiver);
	const modify_message = { room, sender, text, time };
	let result = await db.privatemessages.createPrivateMessage(modify_message);
	return { status: STATUS.OK };
};

Service.prototype.readMessage = async function(sender, receiver) {
	let is_valid = typeof(sender) === 'string';
	is_valid = is_valid && typeof(receiver) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}

	const room = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2(sender, receiver);
	if (room === null) {
		return { status: STATUS.REJECT, reason: 'may not friends'};
	}
	const result = await db.privatemessages.updateIsReadBySenderAndRoom(sender, room);
	if (!result) {
		return { status: STATUS.REJECT, reason: 'nothing update'};
	}
	return { status: STATUS.OK }
};

/**
 * Expose `Service`
 */
module.exports = Service;
