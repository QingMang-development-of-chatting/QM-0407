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

Requester.prototype.getFriends = function(username=':username') {
	return this._axios.get(
		HTTP.V1.FRIEND.GET_FRIENDS
			.replace(':username', username)
		);
};

Requester.prototype.rejectApplicant = function(username=':username', applicant=':applicant') {
	return this._axios.put(
		HTTP.V1.FRIEND.REJECT_APPLICANT
			.replace(':username', username)
			.replace(':applicant', applicant)
		);
};

Requester.prototype.getApplicants = function(username=':username') {
	return this._axios.get(
		HTTP.V1.FRIEND.GET_APPLICANTS
			.replace(':username', username)
		);
};

/**
 * Expose `Requester`
 */
module.exports = Requester;
