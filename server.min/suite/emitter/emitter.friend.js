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

Emitter.prototype.sendApply = function(responser, callback) {
	return new Promise(resolve => {
		this._socket.emit(EVENT.FRIEND.SEND_APPLY, responser, param => {
			callback(param, resolve);
		});
	});
};

Emitter.prototype.responseAccess = function(requester, callback) {
	return new Promise(resolve => {
		this._socket.emit(EVENT.FRIEND.SEND_ACCESS, requester, param => {
			callback(param, resolve);
		});
	});
};

Emitter.prototype.sendDelete = function(friend, callback) {
	return new Promise(resolve => {
		this._socket.emit(EVENT.FRIEND.SEND_DELETE, friend, param => {
			callback(param, resolve);
		});
	});
};

Emitter.prototype.listenReceiveApply = function(callback) {
	this._socket.on(EVENT.FRIEND.RECE_APPLY, callback);
	return this;
};

Emitter.prototype.listenReceiveAccessd = function(callback) {
	this._socket.on(EVENT.FRIEND.RECE_ACCESSED, callback);
	return this;
};

Emitter.prototype.listenReceiveDeleted = function(callback) {
	this._socket.on(EVENT.FRIEND.RECE_DELETED, callback);
	return this;
};

/**
 * Expose `Emitter`
 */
module.exports = Emitter;
