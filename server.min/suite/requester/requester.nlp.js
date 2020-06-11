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

Requester.prototype.cloud = function(username=':username') {
	return this._axios.get(HTTP.V1.NLP.CLOUD.replace(':username', username));
};

/**
 * Expose `Requester`
 */
module.exports = Requester;
