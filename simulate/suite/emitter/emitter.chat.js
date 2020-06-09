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

Emitter.prototype.sendMessage = function(message, callback) {
	return new Promise(resolve => {
		this._socket.emit(EVENT.CHAT.SEND_MESSAGE, message, param => {
			callback(param, resolve);
		});
	});
};

Emitter.prototype.sendReadMessage = function(sender, callback) {
	return new Promise(resolve => {
		this._socket.emit(EVENT.CHAT.SEND_READ_MESSAGE, sender, param => {
			callback(param, resolve);
		});
	});
};

Emitter.prototype.listenReceiveMessage = function(callback) {
	this._socket.on(EVENT.CHAT.RECE_MESSAGE, callback);
};

Emitter.prototype.listenReceiveReadMessage = function(callback) {
	this._socket.on(EVENT.CHAT.RECE_READ_MESSAGE, callback);
};

/**
 * Expose `Emitter`
 */
module.exports = Emitter;
