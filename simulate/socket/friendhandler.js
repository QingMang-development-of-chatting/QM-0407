/**
 * Module dependencies
 */
const { friend_service } = require('../simulate/servicesingleton');
const { BasicEventHandler } = require('../util');
const user_socket_bimap = require('./usersocketbimapsingleton');
const { SERVICE, EVENT: { FRIEND: FRIEND }, SOCKET } = require('../constant');

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
		let requester = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!requester) {
			callback({status: SOCKET.STATUS.REJECT, reason: 'no login'});
			return;
		}

		const is_valid = typeof(responser) === 'string';
		if (!is_valid) {
			callback({
				status: SOCKET.STATUS.BAD_PARAM,
				reason: 'bad parameters\nresponser: expect String'
			});
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
		else if (result.status === SERVICE.STATUS.BAD_PARAM) {
			throw new Error('EventHandler: onSendApply. bad parameters');
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
		let responser = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!responser) {
			callback({status: SOCKET.STATUS.REJECT, reason: 'no login'});
			return;
		}

		const is_valid = typeof(requester) === 'string';
		if (!is_valid) {
			callback({
				status: SOCKET.STATUS.BAD_PARAM,
				reason: 'bad parameters\nrequester: expect String'
			});
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
		else if (result.status === SERVICE.STATUS.BAD_PARAM) {
			throw new Error('EventHandler: onResponseAccess. bad parameters');
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
		let username = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!username) {
			callback({status: SOCKET.STATUS.REJECT, reason: 'no login'});
			return;
		}

		const is_valid = typeof(friend) === 'string';
		if (!is_valid) {
			callback({
				status: SOCKET.STATUS.BAD_PARAM,
				reason: 'bad parameters\nfriend: expect String'
			});
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
		else if (result.status === SERVICE.STATUS.BAD_PARAM) {
			throw new Error('EventHandler: onSendDelete. bad parameters');
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
