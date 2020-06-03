/**
 * Module dependencies
 */
const io = require('socket.io-client');
const axios = require('axios').default;
const { Scanner } = require('../util');
const { HTTP, EVENT: { USER: USER }, SOCKET } = require('../constant');

const socket = io('http://localhost:3000/');
const scanner = new Scanner();
axios.defaults.baseURL = 'http://127.0.0.1:3000';
const user = {};

const requestRegister = function(username, password, nickname) {
	return axios.post(HTTP.V1.USER.REGISTER, { username, password, nickname });
};

socket.on(USER.LOGOUT, result => { console.log(result); });

async function fn() {
	let send;
	const username = await scanner.readString('your username: ');
	const password = await scanner.readString('your password: ');
	const nickname = await scanner.readString('your nickname: ');
	user.username = username;
	user.password = password;
	// await requestRegister(username, password, nickname);

	// console.log(`Expect ${SOCKET.STATUS.OK}`);
	// await new Promise( reslove => socket.emit(USER.LOGIN, user.username, user.password, result => {
	// 	console.log(result);reslove();
	// }));
	console.log(`Expect ${SOCKET.STATUS.OK}`);
	await new Promise( reslove => socket.emit(USER.LOGOUT, result => {
		console.log(result);reslove();
	}));
}

fn();
