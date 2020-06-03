/**
 * Module dependencies
 */
const io = require('socket.io-client');
const axios = require('axios').default;
const { Scanner } = require('./util');
const { HTTP, EVENT: { USER: USER, CHAT: CHAT } } = require('./constant');

/**
 * Socket
 */
const socket = io('http://localhost:3000/');

let username;
let is_login = false;

const scanner = new Scanner();
const tolerance = 3000;

axios.defaults.baseURL = 'http://127.0.0.1:3000';

const emitLogin = async function(username) {
	console.log('Loading...');
	const result = await new Promise(resolve => {
		setTimeout(resolve, tolerance, false);
		socket.emit(USER.LOGIN, username, reason => {
			if (reason === 'ok' || reason === 'already login') {
				is_login = true;
				console.log('Login succeed.');
				resolve(true);
				return;
			}
			console.log(`Login fails, reason ${reason}`);
			is_login = false;
			resolve(true);
		});
	});
	if (!result) {
		console.log('No reply received before timeout.');
		socket.sendBuffer = [];
	}
};

const emitLogout = async function() {
	console.log('Loading...');
	const result = await new Promise(resolve => {
		setTimeout(resolve, tolerance, false);
		socket.emit(USER.LOGOUT, reason => {
			console.log(`You're logout, reason ${reason}`);
			is_login = false;
			resolve(true);
		});
	});
	if (!result) {
		console.log('No reply received before timeout.');
		socket.sendBuffer = [];
	}
};

const emitSendMessage = async function(message) {
	console.log('Loading...');
	const result = await new Promise(resolve => {
		setTimeout(resolve, tolerance, false);
		socket.emit(CHAT.SEND_MESSAGE, message, reason => {
			if (reason !== 'ok') {
				console.log(`Send fails, reason ${reason}`);
				resolve(true);
				return;
			}
			console.log('Send succeeds!');
			resolve(true);
		});
	});
	if (!result) {
		console.log('No reply received before timeout.');
		socket.sendBuffer = [];
	}
};

const onReconnect = function() {
	socket.on('reconnect', async () => {
		if (is_login) {
			console.log('Tring relogin...');
			await emitLogin(username);
		}
	});
};

const onLogout = function() {
	socket.on(USER.LOGOUT, reason => {
		console.log(`You're logout, reason ${reason}`);
	});
};

const onReceiveMessage = function() {
	socket.on(CHAT.RECE_MESSAGE, message => {
		const { sender, text, time } = message;
		console.log('-> You received a message!');
		console.log(`   ${sender}: "${text}"`);
		console.log(`   ${new Date(time)}`);
	});
};

const requestRegister = function(username, password, nickname) {
	return axios.post(HTTP.V1.USER.REGISTER, { username, password, nickname });
};

const Register = async function() {
	let answer;
	const _username = await scanner.readString('username: ');
	const _password = await scanner.readString('password: ');
	const _nickname = await scanner.readString('nickname: ');
	do {
			answer = await scanner.readString('(y/n)');
	} while (answer !== 'y' && answer !== 'n');
	if (answer === 'y') {
		await requestRegister(_username, _password, _nickname)
		.then(response => {
			if (response.status === 201) {
				console.log('Register succeed.');
				username = _username;
				emitLogin(username);
			}
		})
		.catch(error => {
			if (error.response.status === 400 || error.response.status === 408) {
				const reason = error.response.data;
				console.log(`Register fails, reason ${reason}`);
			}
			else {
				console.log(`No reply received before timeout.`);
			}
		});
	}
};

onReconnect();
onLogout();
onReceiveMessage();

async function fn() {
	let send;
	while (send = await scanner.readString('> ')) {
		if (send === 'register') {
			await Register();
		}
		if (send === 'login') {
			username = await scanner.readString('Your username: ');
			await emitLogin(username);
		}
		if (send === 'logout') {
			await emitLogout();
		}
		if (send === 'talk') {
			const receiver = await scanner.readString('Receiver name: ');
			const text = await scanner.readString('type: ');
			const time = new Date().getTime();
			const message = { receiver, text, time };
			await emitSendMessage(message);
		}
		if (send === 'exit') {
			scanner.close();
			process.exit;
		}
	}
}

fn();
