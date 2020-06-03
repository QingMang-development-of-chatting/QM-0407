/**
 * Module dependencies
 */
const db = require('./dbsingleton.js');
const { NOTIFICATION, SERVICE: { STATUS: STATUS } } = require('../constant');

/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

/**
 * Get the friends of `username`.
 *
 * Examples:
 *
 *   service.getFriends('Steve Jobs');
 *
 * @param {*} username
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getFriends = async function(username) {
	let is_valid = typeof(username) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	const result = await db.friends.readFriendsByUsername(username);
	if (result === null) {
		return { status: STATUS.OK, data: [] };
	}
	return { status: STATUS.OK, data: [...result] };
};

/**
 * Get the notifications of `username`.
 *
 * Examples:
 *
 *   service.getNotification('Steve Jobs');
 *
 * @param {*} username
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getNotification = async function(username) {
	let is_valid = typeof(username) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	const result = await db.notifications.readNotificationsByReceiver(username);
	if (result === null) {
		return { status: STATUS.OK, data: [] };
	}
	return { status: STATUS.OK, data: result };
};

/**
 * Send the apply notification from `requester` to `responser`.
 *
 * Examples:
 *
 *   service.applyUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {*} requester
 * @param {*} responser
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.applyUserToBeFriend = async function(requester, responser) {
	let is_valid = typeof(requester) === 'string';
	is_valid = is_valid && typeof(responser) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}

	if (requester === responser) {
		return { status: STATUS.REJECT, reason: 'same user' };
	}

	const notification = {
		sender: requester,
		receiver: responser,
		type: NOTIFICATION.TYPE.APPLY
	};
	const result1 = await db.friends.readFriendsByUsername(requester);
	if (result1 !== null && result1.has(responser)) {
		return { status: STATUS.REJECT, reason: 'already friends' };
	}
	const result2 = await db.notifications.createNotification(notification);
	if (result2) {
		return { status: STATUS.OK };
	}
	return { status: STATUS.REJECT, reason: 'resent' };
};

/**
 * Send the access notification from `responser` to `requester`,
 * set the apply notification from `requester` to `responser` access,
 * create a private room for them and add each other to friend list.
 *
 * Examples:
 *
 *   service.accessUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {*} requester
 * @param {*} responser
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.accessUserToBeFriend = async function(responser, requester) {
	let is_valid = typeof(requester) === 'string';
	is_valid = is_valid && typeof(responser) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}

	const notification = {
		sender: responser,
		receiver: requester,
		type: NOTIFICATION.TYPE.ACCESSED
	};
	const result1 = await db.notifications.createNotification(notification);
	const result2 = await db.notifications.updateTypeBySenderAndReceiverAndType(
		requester, responser, NOTIFICATION.TYPE.APPLY, NOTIFICATION.TYPE.ACCESS);
	const result3 = await db.friends.createFriends(responser, requester);
	await db.privaterooms.createPrivateRoom(responser, requester);
	if (result1 && result2 && result3) {
		return { status: STATUS.OK };
	}
	return { status: STATUS.REJECT, reason: 'may resent or no such applicant or already friends' };
};

/**
 * Set the apply notification from `requester` to `responser` reject.
 *
 * Examples:
 *
 *   service.accessUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {*} requester
 * @param {*} responser
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.rejectUserToBeFriend = async function(responser, requester) {
	let is_valid = typeof(requester) === 'string';
	is_valid = is_valid && typeof(responser) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}

	const result = await db.notifications.updateTypeBySenderAndReceiverAndType(
		requester, responser, NOTIFICATION.TYPE.APPLY, NOTIFICATION.TYPE.REJECT);
	if (result) {
		return { status: STATUS.OK };
	}
	return { status: STATUS.REJECT, reason: 'may no such applicant' };
};

/**
 * Send the deleted notification from `responser` to `requester`,
 * and delete each other to friend list.
 *
 * Examples:
 *
 *   service.deleteFriend('Steve Jobs', 'Wozniak');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.deleteFriend = async function(username1, username2) {
	let is_valid = typeof(username1) === 'string';
	is_valid = is_valid && typeof(username2) === 'string';

	if (!is_valid) {
		return { status: STATUS.BAD_PARAM, reason: 'type error' };
	}
	if (username1 === username2) {
		return { status: STATUS.REJECT, reason: 'same user' };
	}

	const notification = {
		sender: username1,
		receiver: username2,
		type: NOTIFICATION.TYPE.DELETED
	};
	const result1 = await db.notifications.createNotification(notification);
	const result2 = await db.friends.deleteFriendsByUsernames(username1, username2);
	if (result1 && result2) {
		return { status: STATUS.OK };
	}
	return { status: STATUS.REJECT, reason: 'not friends or resent' };
};

/**
 * Expose `Service`
 */
module.exports = Service;
