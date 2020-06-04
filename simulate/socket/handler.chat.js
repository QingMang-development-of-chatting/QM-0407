/**
 * Module dependencies
 */
const { chat_service } = require('../simulate/service.singleton');
const { BasicEventHandler } = require('../util');
const user_socket_bimap = require('./usersocketbimap.singleton');
const { SERVICE, EVENT: { CHAT: CHAT }, SOCKET, REASON } = require('../constant');

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
 * Transmit the private message.
 *
 * Examples:
 *
 *   this._transmitPrivateMessage();
 *
 * @param {String} sender
 * @param {String} receiver
 * @param {Object} message
 * @param {String} message.text
 * @param {Number} message.time
 * @api private
 */
EventHandler.prototype._transmitPrivateMessage = function(sender, receiver, message) {
	const receiver_socket_id = user_socket_bimap.getSocketByUser(receiver);
	if (receiver_socket_id) {
		const { text, time } = message;
		const modify_message = { sender, text, time };
		this._socket.to(receiver_socket_id).emit(CHAT.RECE_MESSAGE, modify_message);
	}
};

/**
 * Hint the `sender` the private message is read by `receiver`.
 *
 * Examples:
 *
 *   this._hintReadPrivateMessage();
 *
 * @param {String} sender
 * @param {String} receiver
 * @api private
 */
EventHandler.prototype._hintReadPrivateMessage = function(sender, receiver) {
	const sender_socket_id = user_socket_bimap.getSocketByUser(sender);
	if (sender_socket_id) {
		this._socket.to(sender_socket_id).emit(CHAT.RECE_READ_MESSAGE, receiver);
	}
};

/**
 * Listen the `send message` event.
 *
 * Examples:
 *
 *   eventhandle.onSendMessage();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onSendMessage = function() {
	this._socket.on(CHAT.SEND_MESSAGE, async (message, callback) => {
		let sender = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!sender) {
			callback({status: SOCKET.STATUS.REJECT, reason: REASON.SEND_MESSAGE.NO_LOGIN});
			return;
		}

		const { receiver, text, time } = message;
		const is_valid_receiver = typeof(receiver) === 'string';
		const is_valid_text = typeof(text) === 'string';
		const is_valid_time = typeof(time) === 'number';
		const is_valid = is_valid_receiver && is_valid_text && is_valid_time;
		if (!is_valid) {
			callback({status: SOCKET.STATUS.BAD_PARAM});
			return;	
		}

		const modify_message = { sender, receiver, text, time };
		const result = await chat_service.addMessage(modify_message);
		if (result.status === SERVICE.STATUS.OK) {
			this._transmitPrivateMessage(sender, receiver, message);
			callback({status: SOCKET.STATUS.OK});
		}
		else if (result.status === SERVICE.STATUS.REJECT) {
			callback({status: SOCKET.STATUS.REJECT, reason: result.reason});
		}
	});

	return this;
};

/**
 * Listen the `read message` event.
 *
 * Examples:
 *
 *   eventhandle.onSendReadMessage();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onSendReadMessage = function() {
	this._socket.on(CHAT.SEND_READ_MESSAGE, async (sender, callback) => {
		let receiver = user_socket_bimap.getUserBySocket(this._socket.id);
		if (!receiver) {
			callback({status: SOCKET.STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NO_LOGIN});
			return;
		}

		const is_valid = typeof(sender) === 'string';
		if (!is_valid) {
			callback({status: SOCKET.STATUS.BAD_PARAM});
			return;	
		}

		const result = await chat_service.readMessage(sender, receiver);
		if (result.status === SERVICE.STATUS.OK) {
			this._hintReadPrivateMessage(sender, receiver);
			callback({status: SOCKET.STATUS.OK});
		}
		else if (result.status === SERVICE.STATUS.REJECT) {
			callback({status: SOCKET.STATUS.REJECT, reason: result.reason});
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
