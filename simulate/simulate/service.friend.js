/**
 * Module dependencies
 */
const db = require('./db.singleton');
const { NOTIFICATION, SERVICE: { STATUS: STATUS }, REASON } = require('../constant');

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
 * @param {String} username
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getFriends = async function(username) {
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
 * @param {String} username
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getNotification = async function(username) {
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
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.applyUserToBeFriend = async function(requester, responser) {
	if (requester === responser) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.SAME_USER };
	}

	const notification = {
		sender: requester,
		receiver: responser,
		type: NOTIFICATION.TYPE.APPLY
	};
	const result1 = await db.friends.readFriendsByUsername(requester);
	if (result1 !== null && result1.has(responser)) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.ALREADY_FRIENDS };
	}
	const result2 = await db.notifications.createNotification(notification);
	if (result2) {
		return { status: STATUS.OK };
	}
	return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.RESENT };
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
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.accessUserToBeFriend = async function(responser, requester) {
	if (responser === requester) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.ACCESS.SAME_USER };
	}
	const notification = {
		sender: responser,
		receiver: requester,
		type: NOTIFICATION.TYPE.ACCESSED
	};
	const result_notification_update = await db.notifications.updateTypeBySenderAndReceiverAndType(
		requester, responser, NOTIFICATION.TYPE.APPLY, NOTIFICATION.TYPE.ACCESS);
	if (!result_notification_update) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.ACCESS.NO_SUCH_APLLICANT };
	}
	const result_friends_make = await db.friends.createFriends(responser, requester);
	if (!result_friends_make) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.ACCESS.ALREADY_FRIENDS };
	}
	await db.notifications.createNotification(notification);
	await db.privaterooms.createPrivateRoom(responser, requester);
	return { status: STATUS.OK };
};

/**
 * Set the apply notification from `requester` to `responser` reject.
 *
 * Examples:
 *
 *   service.accessUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.rejectUserToBeFriend = async function(responser, requester) {
	const result = await db.notifications.updateTypeBySenderAndReceiverAndType(
		requester, responser, NOTIFICATION.TYPE.APPLY, NOTIFICATION.TYPE.REJECT);
	if (result) {
		return { status: STATUS.OK };
	}
	return { status: STATUS.REJECT, reason: REASON.FRIEND.REJECT.NO_SUCH_APLLICANT };
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
	if (username1 === username2) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.DELETE.SAME_USER };
	}

	const notification = {
		sender: username1,
		receiver: username2,
		type: NOTIFICATION.TYPE.DELETED
	};
	const result_friend_delete = await db.friends.deleteFriendsByUsernames(username1, username2);
	if (!result_friend_delete) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.DELETE.NO_SUCH_FRIEND };
	}
	await db.notifications.createNotification(notification);
	return { status: STATUS.OK };
};

/**
 * Expose `Service`
 */
module.exports = Service;
