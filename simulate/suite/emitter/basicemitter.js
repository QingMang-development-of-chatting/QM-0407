/**
 * `BasicEmitter` constructor
 *
 * @api public
 */
function BasicEmitter() {
	this._socket;
}

/**
 * Bind socket to the emitter.
 *
 * Examples:
 * 
 *   basic_emitter.bindSocket(socket);
 *
 * @api public
 */
BasicEmitter.prototype.bindSocket = function(socket) {
	this._socket = socket;
};

/**
 * Expose `BasicEmitter`
 */
module.exports = BasicEmitter;
