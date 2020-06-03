/**
 * Module dependencies
 */
const readline = require('readline');

/**
 * `BasicBiMap` constructor
 *
 * @param {Map} keyToValue (default: new Map())
 * @param {Map} valueToKey (default: new Map())
 * @api public
 */
function BasicBiMap(keyToValue=new Map(), valueToKey=new Map()) {
	this._keyToValue = keyToValue;
	this._valueToKey = valueToKey;
}

/**
 * Map the `key` to the `value`.
 *
 * Examples:
 *
 *   basicbimap.set('hello', 'world');
 *
 * @param {*} key
 * @param {*} value
 * @api public
 */
BasicBiMap.prototype.set = function(key, value) {
	if (this._keyToValue.has(key)) {  // removes old_value->current_key
		const value = this._keyToValue.get(key);
		this._valueToKey.delete(value);
	}
	if (this._valueToKey.has(value)) {  // remove old_key->current_value
		const key = this._valueToKey.get(value);
		this._keyToValue.delete(key);
	}
	this._keyToValue.set(key, value);
	this._valueToKey.set(value, key);
};

/**
 * Get the `value` the `key` to.
 *
 * Examples:
 *
 *   basicbimap.get('hello');  // => 'world'
 *
 * @param {*} key
 * @return {*} value
 * @api public
 */
BasicBiMap.prototype.get = function(key) {
	return this._keyToValue.get(key);
};

/**
 * Delete the `key`-`value` pair.
 *
 * Examples:
 *
 *   basicbimap.delete('hello');
 *
 * @param {*} key
 * @return {Boolean} succeed or fail
 * @api public
 */
BasicBiMap.prototype.delete = function(key) {
	const value = this._keyToValue.get(key);
	return this._valueToKey.delete(value) && this._keyToValue.delete(key);
};

/**
 * `BiMap` constructor
 *
 * @api public
 */
function BiMap() {
	const keyToValue = new Map();
	const valueToKey = new Map();
	this.regular = new BasicBiMap(keyToValue, valueToKey);
	this.inverse = new BasicBiMap(valueToKey, keyToValue);
}

/**
 * `Scanner` constructor
 *
 * @api public
 */
function Scanner() {
	// binds the standard I/O stream to interface
	this._rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
}

/**
 * Scan a line on terminal and convert to string.
 *
 * Examples:
 *
 *   await scanner.readString('y/n');
 *
 * @param {String} prompt
 * @return {Promise} for asynchronism
 * @api public
 */
Scanner.prototype.readString = function(prompt='') {
	return new Promise(reslove => {
		this._rl.question(prompt, line => {
			reslove(line);
		});
	});
};

/**
 * Terminate `Scanner`.
 *
 * Examples:
 *
 *   scanner.close();
 *
 * @api public
 */
Scanner.prototype.close = function() {
	this._rl.close();
};

/**
 * Sleep for a moment.
 *
 * Examples:
 *
 *   await sleep(1000);  // sleep for 1s
 *
 * @param {Number} time (default: 0)
 * @return {Promise} for asynchronism
 * @api public
 */
const sleep = function(time=0) {
	return new Promise(resolve => {
		setTimeout(resolve, time);
	});
};

/**
 * Sleep for a random moment longer than `min` but less than `max`.
 *
 * Examples:
 *
 *   await randDelay();  // no sleep
 *
 *   await randDelay(1000);  // sleep for 0 ~ 1s
 *
 *   await randDelay(5000，1000);  // sleep for 1 ~ 5s
 *
 * @param {Number} max (default: 0)
 * @param {Number} min (default: 0)
 * @api private
 */
const randDelay = function(max=0, min=0) {
	const time = Math.floor(Math.random() * (max - min + 1)) + min;
	return sleep(time);
};

/**
 * `BasicEventHandler` constructor
 *
 * @api public
 */
function BasicEventHandler() {
	this._socket;
}

/**
 * Bind the socket to the handler.
 *
 * Examples:
 *
 *   eventhandle.bindSocket(socket);
 *
 * @param {Socket} socket
 * @return {BasicEventHandler} for chaining
 * @api public
 */
BasicEventHandler.prototype.bindSocket = function(socket) {
	this._socket = socket;
	return this;
};

/**
 * Expose utilities
 */
module.exports = {
	BasicBiMap: BasicBiMap,
	BiMap: BiMap,
	Scanner: Scanner,
	sleep: sleep,
	randDelay: randDelay,
	BasicEventHandler: BasicEventHandler
};
