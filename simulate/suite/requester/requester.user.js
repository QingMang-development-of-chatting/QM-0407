/**
 * Module dependencies
 */
const BasicRequester = require('./basicrequester');
const { HTTP } = require('../../constant');

/**
 * `Requester` constructor
 *
 * @api public
 */
function Requester() {
	BasicRequester.call(this);
}

// modifies the prototype chain
Requester.prototype = Object.create(BasicRequester.prototype);
Requester.prototype.constructor = BasicRequester;

Requester.prototype.register = function(username) {
	return this._axios.post(HTTP.V1.USER.REGISTER, { username, password, nickname });
};

/**
 * Expose `Requester`
 */
module.exports = Requester;
