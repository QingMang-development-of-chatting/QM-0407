/**
 * Module dependencies
 */
const axios = require('axios').default;
const { HTTP } = require('../constant');

// sets HTTP base URL
axios.defaults.baseURL = 'http://127.0.0.1:3000';

/**
 * Request register HTTP.
 *
 * Examples:
 *
 *   requestRegister('Juncheng Zeng', '0712', 'ZengJia');
 *
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Promise} for asynchronism
 * @api private
 */
const requestRegister = function(username, password, nickname) {
	return axios.post(HTTP.V1.USER.REGISTER, { username, password, nickname });
};

/**
 * Handle register HTTP response.
 *
 * Examples:
 *
 *   register('Juncheng Zeng', '0712', 'ZengJia');
 *
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @api private
 */
const register = async function(username, password, nickname) {
	await requestRegister(username, password, nickname)
	.then(response => {
		if (response.status === 201) {
			console.log(`Register succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400 || error.response.status === 409) {
			const reason = error.response.data;
			console.log(`Register fail, status: ${error.response.status} reason ${reason}`);
		}
	});
};

async function test() {
	console.log('Expect fail, status 400');
	await register();
	await register(1);
	await register('Juncheng Zeng');
	await register('Juncheng Zeng', 1);
	await register('Juncheng Zeng', '0712');
	await register('Juncheng Zeng', '0712', 1);
	console.log('Expect succeed, status 201');
	await register('Juncheng Zeng', '0712', 'ZengJia');
	console.log('Expect fail, status 409');
	await register('Juncheng Zeng', '1234', 'ZengJia');
}

test();
