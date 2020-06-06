/**
 * Module dependencies
 */
// TODO: require `query`
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
 * @return {Object{status, data}} for result
 * @api public
 */
Service.prototype.getFriends = async function(username) {
	// TODO: query DB

	// TODO: case: OK
	// TODO: convert query result to [friendname(String)](Array)
	return { status: STATUS.OK, data: ... };
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
	// TODO: query DB, including notifications that pending, reject, access and be deleted.

	// TODO: case: OK

	// TODO: convert query result to [{sender(String), type(see below)}](Array)
	// type is NOTIFICATION.TYPE.APPLY if pending
	// type is NOTIFICATION.TYPE.ACCESS if the applicant is accessd
	// type is NOTIFICATION.TYPE.REJECT if the applicant is rejected
	// type is NOTIFICATION.TYPE.ACCESSED if you're accessed
	// type is NOTIFICATION.TYPE.DELETED if you're deleted
	return { status: STATUS.OK, data: ... };
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
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.applyUserToBeFriend = async function(requester, responser) {
	if (requester === responser) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.SAME_USER };
	}

	// TODO: query the database, create a notification

	// TODO: case: already friends
	return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.ALREADY_FRIENDS };
	// TODO: case: resent
	return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.RESENT };
	// TODO: case: OK
	return { status: STATUS.OK };
};

/**
 * Send the access notification from `responser` to `requester`,
 * set the apply notification from `requester` to `responser` access,
 * add each other to friend list.
 *
 * Examples:
 *
 *   service.accessUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.accessUserToBeFriend = async function(responser, requester) {
	if (responser === requester) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.ACCESS.SAME_USER };
	}

	// TODO: query DB. set the type of notification is access

	// TODO: case: no such applicant
	return { status: STATUS.REJECT, reason: REASON.FRIEND.ACCESS.NO_SUCH_APLLICANT };

	// TODO: query DB. send a notification that type is accessd to applicant.

	// TODO: case: OK
	{ status: STATUS.OK }
};

/**
 * Set the reject notification from `requester` to `responser`.
 *
 * Examples:
 *
 *   service.accessUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.rejectUserToBeFriend = async function(responser, requester) {
	// TODO: query DB. Just set the type of notification reject.

	// TODO: case: OK
	return { status: STATUS.OK };

	// TODO: case: no such applicant
	return { status: STATUS.REJECT, reason: REASON.FRIEND.REJECT.NO_SUCH_APLLICANT };
};

/**
 * Send the deleted notification from `responser` to `requester`,
 * and delete each other from friend list.
 *
 * Examples:
 *
 *   service.deleteFriend('Steve Jobs', 'Wozniak');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.deleteFriend = async function(username1, username2) {
	if (username1 === username2) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.DELETE.SAME_USER };
	}

	// TODO: query DB, delete each other

	// TODO: case: no such friend
	return { status: STATUS.REJECT, reason: REASON.FRIEND.DELETE.NO_SUCH_FRIEND };

	// TODO: send deleted notification to the deleted friend

	// TODO: case: OK
	return { status: STATUS.OK };
};

/**
 * Expose `Service`
 */
module.exports = Service;
