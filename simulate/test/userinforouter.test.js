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
 * Request register HTTP.
 *
 * Examples:
 *
 *   requestGetInfo('Juncheng Zeng');
 *
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Promise} for asynchronism
 * @api private
 */
const requestGetInfo = function(username) {
	return axios.get(HTTP.V1.USERINFO.GET_INFO.replace(':username', username), { username });
};

/**
 * Request set password HTTP.
 *
 * Examples:
 *
 *   requestSetPassword('Juncheng Zeng', '1234');
 *
 * @param {String} username
 * @param {String} password
 * @return {Promise} for asynchronism
 * @api private
 */
const requestSetPassword = function(username, password) {
	return axios.put(HTTP.V1.USERINFO.SET_PASSWORD.replace(':username', username), { password });
};

/**
 * Request set nickname HTTP.
 *
 * Examples:
 *
 *   requestSetNickname('Juncheng Zeng', 'ZengJia2020');
 *
 * @param {String} username
 * @param {String} nickname
 * @return {Promise} for asynchronism
 * @api private
 */
const requestSetNickname = function(username, nickname) {
	return axios.put(HTTP.V1.USERINFO.SET_NICKNAME.replace(':username', username), { nickname });
};

/**
 * Request set photo HTTP.
 *
 * Examples:
 *
 *   requestSetPhoto('Juncheng Zeng', '!@#$%');
 *
 * @param {String} username
 * @param {String} photo
 * @return {Promise} for asynchronism
 * @api private
 */
const requestSetPhoto = function(username, photo) {
	return axios.put(HTTP.V1.USERINFO.SET_PHOTO.replace(':username', username), { photo });
};

/**
 * Handle get info HTTP response.
 *
 * Examples:
 *
 *   getInfo('Juncheng Zeng');
 *
 * @param {String} username
 * @api private
 */
const getInfo = async function(username) {
	await requestGetInfo(username)
	.then(response => {
		if (response.status === 200) {
			console.table([response.data]);
			console.log(`GetInfo succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400) {
			const reason = error.response.data;
			console.log(`GetInfo fail, status: ${error.response.status} reason ${reason}`);
		}
		else if (error.response.status === 404) {
			console.log(`GetInfo fail, status: ${error.response.status}`);
		}
	});
};

/**
 * Handle set password HTTP response.
 *
 * Examples:
 *
 *   setPassword('Juncheng Zeng', '1234');
 *
 * @param {String} username
 * @param {String} password
 * @api private
 */
const setPassword = async function(username, password) {
	await requestSetPassword(username, password)
	.then(response => {
		if (response.status === 200) {
			console.log(`SetPassword succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400) {
			const reason = error.response.data;
			console.log(`SetPassword fail, status: ${error.response.status} reason ${reason}`);
		}
		else if (error.response.status === 404) {
			console.log(`SetPassword fail, status: ${error.response.status}`);
		}
	});
};

/**
 * Handle set nickname HTTP response.
 *
 * Examples:
 *
 *   setNickname('Juncheng Zeng', 'ZengJia2020');
 *
 * @param {String} username
 * @param {String} nickname
 * @api private
 */
const setNickname = async function(username, nickname) {
	await requestSetNickname(username, nickname)
	.then(response => {
		if (response.status === 200) {
			console.log(`SetNickname succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400) {
			const reason = error.response.data;
			console.log(`SetNickname fail, status: ${error.response.status} reason ${reason}`);
		}
		else if (error.response.status === 404) {
			console.log(`SetNickname fail, status: ${error.response.status}`);
		}
	});
};

/**
 * Handle set photo HTTP response.
 *
 * Examples:
 *
 *   setPhoto('Juncheng Zeng', '!@#$%');
 *
 * @param {String} username
 * @param {String} photo
 * @api private
 */
const setPhoto = async function(username, photo) {
	await requestSetPhoto(username, photo)
	.then(response => {
		if (response.status === 200) {
			console.log(`SetPhoto succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400) {
			const reason = error.response.data;
			console.log(`SetPhoto fail, status: ${error.response.status} reason ${reason}`);
		}
		else if (error.response.status === 404) {
			console.log(`SetPhoto fail, status: ${error.response.status}`);
		}
	});
};

async function test() {
	console.log('\nExpect fail, status 404');
	await getInfo();
	await getInfo(1);
	console.log('\nExpect fail, status 400');
	await setPassword();
	await setPassword(1);
	await setPassword('Juncheng Zeng');
	await setPassword('Juncheng Zeng', 1);
	await setNickname();
	await setNickname(1);
	await setNickname('Juncheng Zeng');
	await setNickname('Juncheng Zeng', 1);
	await setPhoto();
	await setPhoto(1);
	await setPhoto('Juncheng Zeng');
	await setPhoto('Juncheng Zeng', 1);
	console.log('\nExpect fail, status 404');
	await getInfo('Juncheng Zeng');
	console.log('\nExpect succeed, status 200');
	await requestRegister('Juncheng Zeng', '0712', 'ZengJia');
	await getInfo('Juncheng Zeng');
	await setPassword('Juncheng Zeng', '1234');
	await getInfo('Juncheng Zeng');
	await setNickname('Juncheng Zeng', 'ZengJia2020');
	await getInfo('Juncheng Zeng');
	await setPhoto('Juncheng Zeng', '!#$%');
	await getInfo('Juncheng Zeng');
	console.log('\nExpect fail, status 404');
	await setPassword('Yunic', '1234');
	await setNickname('Yunic', 'ZengJia2020');
	await setPhoto('Yunic', '!#$%');
}

test();
