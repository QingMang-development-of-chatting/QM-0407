/**
 * Module dependencies
 */
const { user_service } = require('../simulate/servicesingleton');
const { BasicEventHandler } = require('../util');
const user_socket_bimap = require('./usersocketbimapsingleton');
const { SERVICE, EVENT: { USER: USER }, SOCKET } = require('../constant');

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
 * Listen the `login` event.
 *
 * the socket that occupies username will be emitted `logout` event if exists.
 *
 * Examples:
 *
 *   eventhandle.onLogin();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onLogin = function() {
	this._socket.on(USER.LOGIN, async (username, password, callback) => {
		const is_valid_username = typeof(username) === 'string';
		const is_valid_password = typeof(password) === 'string';
		const is_valid = is_valid_username && is_valid_password;
		if (!is_valid) {
			let reason = 'bad parameters';
			if (!is_valid_username) {
				reason += '\nusername: expect String';
			}
			if (!is_valid_password) {
				reason += '\npassword: expect String';
			}
			callback({status: SOCKET.STATUS.BAD_PARAM, reason: reason});
			return;	
		}

		const result = await user_service.isValid(username, password);
		if (result.status === SERVICE.STATUS.OK) {
			if (result.data === true) {
				const socket_id = user_socket_bimap.getSocketByUser(username);
				if (socket_id && socket_id === this._socket.id) {
					callback({status: SOCKET.STATUS.REJECT, reason: 'already login'});
					return;
				}
				if (socket_id && socket_id !== this._socket.id) {
					user_socket_bimap.departUserSocketBySocket(socket_id);
					this._socket.to(socket_id).emit(USER.LOGOUT, 'device changed');
				}
				user_socket_bimap.bindUserSocket(username, this._socket.id);
				callback({status: SOCKET.STATUS.OK});
			}
			else if (result.data === false) {
				callback({status: SOCKET.STATUS.REJECT, reason: 'may no such user or wrong password'});
			}
		}
		else if (result.status === SERVICE.STATUS.BAD_PARAM) {
			throw new Error('EventHandler: onLogin. bad parameters');
		}
	});

	return this;
};

/**
 * Listen the `logout` event.
 *
 * Examples:
 *
 *   eventhandle.onLogout();
 *
 * @return {EventHandler} for chaining
 * @api public
 */
EventHandler.prototype.onLogout = function() {
	this._socket.on(USER.LOGOUT, callback => {
		const result = user_socket_bimap.departUserSocketBySocket(this._socket.id);
		if (!result) {
			callback({status: SOCKET.STATUS.REJECT, reason: 'no login'});
		}
		callback({status: SOCKET.STATUS.OK});
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
		user_socket_bimap.departUserSocketBySocket(this._socket.id);
		this._socket = null;
	});
	return this;
};

/**
 * Expose `EventHandler`
 */
module.exports = EventHandler;
