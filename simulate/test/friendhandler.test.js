/**
 * Module dependencies
 */
const io = require('socket.io-client');
const axios = require('axios').default;
const { Scanner } = require('../util');
const { HTTP, EVENT: { USER: USER, FRIEND: FRIEND, CHAT: CHAT }, SOCKET } = require('../constant');

const socket = io('http://localhost:3000/');
const scanner = new Scanner();
axios.defaults.baseURL = 'http://127.0.0.1:3000';

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

socket.on(FRIEND.RECE_APPLY, friend => console.log(`apply: ${friend}`));
socket.on(FRIEND.RECE_ACCESSED, friend => console.log(`accessed: ${friend}`));
socket.on(FRIEND.RECE_DELETED, friend => console.log(`deleted: ${friend}`));
socket.on(CHAT.RECE_MESSAGE, message => console.table(message));
socket.on(CHAT.RECE_READ_MESSAGE, receiver => console.log(`read by ${receiver}`));

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

const sendApply = async function(friend) {
	await new Promise(reslove => {
		socket.emit(FRIEND.SEND_APPLY, friend, res => {
			console.log(res);
			reslove();
		})
	})
};

const accessFriend = async function(friend) {
	await new Promise(reslove => {
		socket.emit(FRIEND.SEND_ACCESS, friend, res => {
			console.log(res);
			reslove();
		})
	})
};

const sendMessage = async function(message) {
	await new Promise(reslove => {
		socket.emit(CHAT.SEND_MESSAGE, message, res => {
			console.log(res);
			reslove();
		})
	})
};

const sendReadMessage = async function(sender) {
	await new Promise(reslove => {
		socket.emit(CHAT.SEND_READ_MESSAGE, sender, res => {
			console.log(res);
			reslove();
		})
	})
};

const deleteFriend = async function(friend) {
	await new Promise(reslove => {
		socket.emit(FRIEND.SEND_DELETE, friend, res => {
			console.log(res);
			reslove();
		})
	})
};

const rejectApplicant = async function(username, applicant) {
	await requestRejectApplicant(username, applicant)
	.then(response => {
		if (response.status === 200) {
			console.log(`SetPassword succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400 || error.response.status === 409) {
			const reason = error.response.data;
			console.log(`SetPassword fail, status: ${error.response.status} reason ${reason}`);
		}
	});
};

const getApplicants = async function(username) {
	await requestGetApplicants(username)
	.then(response => {
		if (response.status === 200) {
			console.table(response.data);
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
			console.table(response.data);
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
			console.table(response.data);
			console.log(`SetPassword succeed. status ${response.status}`);
		}
	})
	.catch(error => {
		if (error.response.status === 400 || error.response.status === 409) {
			const reason = error.response.data;
			console.log(`SetPassword fail, status: ${error.response.status} reason ${reason}`);
		}
	});
};

async function fn() {
	let send;
	const username = await scanner.readString('your username: ');
	const password = await scanner.readString('your password: ');
	const nickname = await scanner.readString('your nickname: ');
	await requestRegister(username, password, nickname);
	console.log(`Expect ${SOCKET.STATUS.OK}`);
	await new Promise( reslove => socket.emit(USER.LOGIN, username, password, result => {
		console.log(result);reslove();
	}));
	while (send = await scanner.readString('> ')) {
		if (send === 'friends') {
			await getFriends(username);
		}
		if (send === 'delete') {
			const friend = await scanner.readString('friend: ');
			await deleteFriend(friend);
		}
		if (send === 'apply') {
			const friend = await scanner.readString('friend: ');
			await sendApply(friend);
		}
		if (send === 'applicants') {
			await getApplicants(username);
		}
		if (send === 'access') {
			const friend = await scanner.readString('friend: ');
			await accessFriend(friend);
		}
		if (send === 'reject') {
			const friend = await scanner.readString('friend: ');
			await rejectApplicant(username, friend);
		}
		if (send === 'chatlist') {
			await getChatList(username);
		}
		if (send === 'history') {
			const friend = await scanner.readString('friend: ');
			await getHistory(username, friend, new Date().getTime());
		}
		if (send === 'message') {
			const receiver = await scanner.readString('friend: ');
			const text = await scanner.readString('text: ');
			const time = new Date().getTime();
			await sendMessage({receiver, text, time});
		}
		if (send === 'read') {
			const sender = await scanner.readString('friend: ');
			await sendReadMessage(sender);
		}
	}
}

fn();

fn();
