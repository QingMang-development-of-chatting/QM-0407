/*
 * Mocing service-database processing
 */

// databse store
const _users = [
	{ // defaule user
		'username': 'username',
		'password': 'password',
		'nickname': 'nickname'
	}
];

/**
 * delay for MS ms
 * pretend to query the cloud DB.
 *
 * @param {Number} ms
 */
const timeout = function(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	})
};

/**
 * username exist?
 * 
 * @param {String} username
 * @return {Boolean}
 */
const isDuplicateUser = function(username) {
	for (let user of _users) {
		if (username !== user.username) continue;
		return true;
	}
	return false;
};

/**
 *
 */
const authenticate = function(username, password) {
 	for (let user of _users) {
 		if (username !== user.username) continue;
 		if (password !== user.password) continue;
 		return true;
 	}
 	return false;
}

/**
 * API
 */
const Service = {};

/**
 * register
 * 
 * static method
 * 
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Boolean}
 */
Service.register = function (username, password, nickname) {
	if (isDuplicateUser(username)) return false;
	_users.push(
		{
			"username": username,
			"password": password,
			"nickname": nickname
		}
	);
	return true;
};

/**
 * login
 * 
 * static method
 * 
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Boolean}
 */
Service.login = function (username, password) {
	if (!authenticate(username, password)) return false;
	return true;
};

module.exports = Service;