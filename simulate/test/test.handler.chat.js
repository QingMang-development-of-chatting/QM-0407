/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const io = require('socket.io-client');
const UserRequester = require('../suite/requester/requester.user');
const FriendRequester = require('../suite/requester/requester.friend');
const ChatRequester = require('../suite/requester/requester.chat');
const UserEmitter = require('../suite/emitter/emitter.user');
const FriendEmitter = require('../suite/emitter/emitter.friend');
const ChatEmitter = require('../suite/emitter/emitter.chat');
const { PORT, AXIOS: { HOST: HOST }, SOCKET, REASON, NOTIFICATION } = require('../constant');
const { sleep } = require('../util');
const server = require('../server');

// activates server
server.listen(PORT);

// sets default base URL
axios.defaults.baseURL = `${HOST}:${PORT}`;

// builds two new sockets
const socket1 = io(SOCKET.HOST);
const socket2 = io(SOCKET.HOST);

// builds requesters
const user_requester = new UserRequester();
const friend_requester = new FriendRequester();
const chat_requester = new ChatRequester();

// binds axios to the requesters
user_requester.bindAxios(axios);
friend_requester.bindAxios(axios);
chat_requester.bindAxios(axios);

// builds emitters
const user_emitter1 = new UserEmitter();
const user_emitter2 = new UserEmitter();
const friend_emitter1 = new FriendEmitter();
const friend_emitter2 = new FriendEmitter();
const chat_emitter1 = new ChatEmitter();
const chat_emitter2 = new ChatEmitter();

// binds socket to the user emitters
user_emitter1.bindSocket(socket1);
user_emitter2.bindSocket(socket2);
friend_emitter1.bindSocket(socket1);
friend_emitter2.bindSocket(socket2);
chat_emitter1.bindSocket(socket1);
chat_emitter2.bindSocket(socket2);

let g_send_message;
let g_receive_message;
chat_emitter2.listenReceiveMessage(function(message) {
	g_receive_message = message;
});
let g_receiver;
chat_emitter1.listenReceiveReadMessage(function(receiver) {
	g_receiver = receiver;
});

describe('Friend', function() {
	describe('#register...', function() {
		it('should response 201', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await user_requester.register('test_user1', 'default password', 'default nickname')
			.then(response => {
				expect(response.status).to.eql(201);
			});
			// case: perform well when new user
			await user_requester.register('test_user2', 'default password', 'default nickname')
			.then(response => {
				expect(response.status).to.eql(201);
			});
		});
	});

	describe('#onSendMessage()', function() {
		it('should response REJECT for no login', async function() {
			this.timeout(50000);
			const message = {
				receiver: 'test_user2',
				text: 'test_text',
				time: new Date().getTime()
			};
			await chat_emitter1.sendMessage(message, function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.SEND_MESSAGE.NO_LOGIN);
				resolve();
			});
		});
	});

	describe('#onSendReadMessage()', function() {
		it('should response REJECT for no login', async function() {
			this.timeout(50000);
			await chat_emitter2.sendReadMessage('test_user1', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.SEND_READ_MESSAGE.NO_LOGIN);
				resolve();
			});
		});
	});

	describe('#login', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			await user_emitter1.login('test_user1', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
			await user_emitter2.login('test_user2', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});
	});

	describe('#make_friends', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			await friend_emitter2.sendApply('test_user1', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});

		it('should response OK', async function() {
			this.timeout(50000);
			await friend_emitter1.responseAccess('test_user2', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});
	});

	describe('#onSendMessage()', function() {
		it('should response BAD PARAM', async function() {
			this.timeout(50000);
			const message = {
				receiver: 'test_user2',
				text: 'test_text',
				time: new Date().getTime()
			};

			// case: receiver type error
			message.receiver = 1;
			await chat_emitter1.sendMessage(message, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});

			// case: text type error
			message.receiver = 'test_user2';
			message.text = 1;
			await chat_emitter1.sendMessage(message, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});

			// case: text type error
			message.text = 'test_text';
			message.time = 'test_time';
			await chat_emitter1.sendMessage(message, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const message = {
				receiver: 'test_user2',
				text: '尼玛， 吗啡',
				time: new Date().getTime()
			};
			g_send_message = message;
			await chat_emitter1.sendMessage(message, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});

		it('should receive meessage', async function() {
			this.timeout(50000);
			await sleep(5000);
			expect(g_receive_message.sender).to.eql('test_user1');
			expect(g_receive_message.text).to.eql('尼玛， **');
			expect(g_receive_message.time).to.eql(g_send_message.time);
			expect(g_receive_message.sentiment).to.be.a('number');
		});
	});

	describe('#onSendReadMessage()', async function() {
		it('should response BAD PARAM', async function() {
			this.timeout(50000);
			// case: type error
			await chat_emitter1.sendReadMessage(1, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});
		});

		it('should response OK', async function() {
			this.timeout(50000);
			// case: type error
			await chat_emitter2.sendReadMessage('test_user1', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});

		it('should receive the receiver\'s name', async function() {
			this.timeout(50000);
			// case: type error
			await sleep(2000);
			expect(g_receiver).to.eql('test_user2');
		});
	});

	after(function() {
		socket1.close();
		socket2.close();
		server.close();
	});
});
