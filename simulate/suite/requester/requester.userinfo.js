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

Requester.prototype.getInfo = function(username) {
	return this._axios.get(
		HTTP.V1.USERINFO.GET_INFO
			.replace(':username', username)
		);
};

Requester.prototype.setPassword = function(username, password) {
	return this._axios.put(
		HTTP.V1.USERINFO.SET_PASSWORD
		.replace(':username', username)
		, { password }
		);
};

Requester.prototype.setNickname = function(username, nickname) {
	return this._axios.put(
		HTTP.V1.USERINFO.SET_NICKNAME
			.replace(':username', username)
			, { nickname }
		);
};

Requester.prototype.setPhoto = function(username, photo) {
	return this._axios.put(
		HTTP.V1.USERINFO.SET_PHOTO
			.replace(':username', username)
			, { photo }
		);
};

/**
 * Expose `Requester`
 */
module.exports = Requester;
