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

Requester.prototype.getChatList = function(username=':username') {
	return this._axios.get(
		HTTP.V1.CHAT.GET_CHATLIST
			.replace(':username', username)
		);
};

Requester.prototype.getHistory = function(username=':username', friend=':friend', time=':time') {
	return this._axios.get(
		HTTP.V1.CHAT.GET_HISTORY
			.replace(':username', username)
			.replace(':friend', friend)
			.replace(':time', time)
		);
};

/**
 * Expose `Requester`
 */
module.exports = Requester;
