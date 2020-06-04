/**
 * Module dependencies
 */
const BasicEmitter = require('./basicemitter');
const { EVENT, REASON } = require('../../constant');

/**
 * `Requester` constructor
 *
 * @api public
 */
function Emitter() {
	BasicEmitter.call(this);
}

// modifies the prototype chain
Emitter.prototype = Object.create(BasicEmitter.prototype);
Emitter.prototype.constructor = BasicEmitter;

Emitter.prototype.login = function(username, password, callback) {
	return new Promise(resolve => {
		this._socket.emit(EVENT.USER.LOGIN, username, password, param => {
			callback(param, resolve);
		});
	});
};

Emitter.prototype.logout = function(callback) {
	return new Promise(resolve => {
		this._socket.emit(EVENT.USER.LOGOUT, param => {
			callback(param, resolve);
		});
	});
};

Emitter.prototype.listenLogout = function(callback) {
	this._socket.on(EVENT.USER.LOGOUT, callback);
	return this;
};

/**
 * Expose `Emitter`
 */
module.exports = Emitter;
