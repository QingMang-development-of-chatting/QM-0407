/**
 * Module dependencies
 */
const { friend_service } = require('../simulate/service.singleton');
const { BasicEventHandler } = require('../util');
const user_socket_bimap = require('./usersocketbimap.singleton');
const { SERVICE, EVENT: { FRIEND: FRIEND }, SOCKET, REASON } = require('../constant');

/**
 * `EventHandler` constructor
 *
 * @api public
 */
function EventHandler() {
	BasicEventHandler.call(this);
}

// modifies the prototype chain
EventHandler.prototype = Object.create(BasicEventHandler.prototype);
EventHandler.prototype.constructor = BasicEventHandler;

/**
 * Listen the `apply a user to be friend` event.
 *
 * Examples:
 *
 *   eventhandle.onSendApply();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onSendApply = function() {
	this._socket.on(FRIEND.SEND_APPLY, async (responser, callback) => {
		const is_valid = typeof(responser) === 'string';
		if (!is_valid) {
			callback({status: SOCKET.STATUS.BAD_PARAM});
			return;	
		}

		let requester = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!requester) {
			callback({status: SOCKET.STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.NO_LOGIN});
			return;
		}

		const result = await friend_service.applyUserToBeFriend(requester, responser);
		if (result.status === SERVICE.STATUS.OK) {
			const responser_socket_id = user_socket_bimap.getSocketByUser(responser);
			if (responser_socket_id) {
				this._socket.to(responser_socket_id).emit(FRIEND.RECE_APPLY, requester);
			}
			callback({status: SOCKET.STATUS.OK});
		}
		else if (result.status === SERVICE.STATUS.REJECT) {
			callback({status: SOCKET.STATUS.REJECT, reason: result.reason})
		}
	});

	return this;
};

/**
 * Listen the `access a user to be friend` event.
 *
 * Examples:
 *
 *   eventhandle.onResponseAccess();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onResponseAccess = function() {
	this._socket.on(FRIEND.SEND_ACCESS, async (requester, callback) => {
		const is_valid = typeof(requester) === 'string';
		if (!is_valid) {
			callback({status: SOCKET.STATUS.BAD_PARAM});
			return;	
		}

		let responser = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!responser) {
			callback({status: SOCKET.STATUS.REJECT, reason: REASON.FRIEND.ACCESS.NO_LOGIN});
			return;
		}

		const result = await friend_service.accessUserToBeFriend(responser, requester);
		if (result.status === SERVICE.STATUS.OK) {
			const requester_socket_id = user_socket_bimap.getSocketByUser(requester);
			if (requester_socket_id) {
				this._socket.to(requester_socket_id).emit(FRIEND.RECE_ACCESSED, responser);
			}
			callback({status: SOCKET.STATUS.OK});
		}
		else if (result.status === SERVICE.STATUS.REJECT) {
			callback({status: SOCKET.STATUS.REJECT, reason: result.reason})
		}
	});

	return this;
};

/**
 * Listen the `access a user to be friend` event.
 *
 * Examples:
 *
 *   eventhandle.onResponseAccess();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onSendDelete = function() {
	this._socket.on(FRIEND.SEND_DELETE, async (friend, callback) => {
		const is_valid = typeof(friend) === 'string';
		if (!is_valid) {
			callback({status: SOCKET.STATUS.BAD_PARAM});
			return;
		}

		let username = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!username) {
			callback({status: SOCKET.STATUS.REJECT, reason: REASON.FRIEND.DELETE.NO_LOGIN});
			return;
		}

		const result = await friend_service.deleteFriend(username, friend);
		if (result.status === SERVICE.STATUS.OK) {
			const friend_socket_id = user_socket_bimap.getSocketByUser(friend);
			if (friend_socket_id) {
				this._socket.to(friend_socket_id).emit(FRIEND.RECE_DELETED, username);
			}
			callback({status: SOCKET.STATUS.OK});
		}
		else if (result.status === SERVICE.STATUS.REJECT) {
			callback({status: SOCKET.STATUS.REJECT, reason: result.reason})
		}
	});

	return this;
};

/**
 * Listen the `disconnect` event.
 *
 * Examples:
 *
 *   eventhandle.onDisconnect();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onDisconnect = function() {
	this._socket.on('disconnect', () => {
		this._socket = null;
	});
	return this;
};

/**
 * Expose `EventHandler`
 */
module.exports = EventHandler;
