/**
 * Module dependencies
 */
const axios = require('axios').default;
const { HTTP } = require('../constant');

// sets HTTP base URL
axios.defaults.baseURL = 'http://127.0.0.1:3000';

const requestGetChatList = function(username) {
	return axios.get(HTTP.V1.CHAT.GET_CHATLIST.replace(':username', username));
};

const requestGetHistory = function(username, friend, time) {
	return axios.get(
		HTTP.V1.CHAT.GET_HISTORY
		.replace(':username', username)
		.replace(':friend', friend)
		.replace(':time', time)
		);
};

const getChatList = async function(username) {
	await requestGetChatList(username)
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

const getHistory = async function(username, friend, time) {
	await requestGetHistory(username, friend, time)
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

async function test() {
	console.log('Expect 200');
	await getChatList('Juncheng Zeng');
	await getHistory('Juncheng Zeng', 'Yunic', new Date().getTime())
}

test();
