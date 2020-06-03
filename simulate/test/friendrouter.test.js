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

const requestGetFriends = function(username) {
	return axios.get(HTTP.V1.FRIEND.GET_FRIENDS.replace(':username', username));
};

const requestRejectApplicant = function(username, applicant) {
	return axios.put(
		HTTP.V1.FRIEND.REJECT_APPLICANT.replace(':username', username).replace(':applicant', applicant)
	);
};

const requestGetApplicants = function(username) {
	return axios.get(HTTP.V1.FRIEND.GET_APPLICANTS.replace(':username', username));
};

const getFriends = async function(username) {
	await requestGetFriends(username)
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
	});
};

const rejectApplicant = async function(username, applicant) {
	await requestRejectApplicant(username, applicant)
	.then(response => {
		if (response.status === 200) {
			console.log(`SetPassword succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400 || error.response.status === 408) {
			const reason = error.response.data;
			console.log(`SetPassword fail, status: ${error.response.status} reason ${reason}`);
		}
	});
};

const getApplicants = async function(username) {
	await requestGetApplicants(username)
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
	});
};

async function test(argument) {
	console.log('Expect succeed, status 200');
	await getFriends('Juncheng Zeng');
	console.log('Expect succeed, status 200');
	await getApplicants('Juncheng Zeng');
	console.log('Expect fail, status 408');
	await rejectApplicant('Juncheng Zeng', 'Yunic');
}

test();