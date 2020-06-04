/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const io = require('socket.io-client');
const UserRequester = require('../suite/requester/requester.user');
const UserEmitter = require('../suite/emitter/emitter.user');
const { PORT, AXIOS: { HOST: HOST }, SOCKET, REASON } = require('../constant');
const { sleep } = require('../util');
const server = require('../server');

// activates server
server.listen(PORT);

// sets default base URL
axios.defaults.baseURL = `${HOST}:${PORT}`;

// builds two new sockets
const socket1 = io(SOCKET.HOST);
const socket2 = io(SOCKET.HOST);

// builds a user requester
const user_requester = new UserRequester();

// binds axios to the user requester
user_requester.bindAxios(axios);

// builds user emitters
const user_emitter1 = new UserEmitter();
const user_emitter2 = new UserEmitter();

// binds socket to the user emitters
user_emitter1.bindSocket(socket1);
user_emitter2.bindSocket(socket2);

let g_hint = null;
user_emitter1.listenLogout(function(reason) {
	g_hint = reason;
});

describe('User', function() {
	describe('#register()', function() {
		it('should response 201', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await user_requester.register('default user', 'default password', 'default nickname')
			.then(response => {
				expect(response.status).to.eql(201);
			});
		});
	});

	describe('#login()', function() {
		it('should response BAD PARAM', async function() {
			this.timeout(50000);
			// case: type error
			await user_emitter1.login(1, 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});

			// case: type error
			await user_emitter1.login('default user', 1, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});
		});

		it('should response OK', async function() {
			this.timeout(50000);
			// case: perform well when login unlogined user
			await user_emitter1.login('default user', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			// case: already login
			await user_emitter1.login('default user', 'default password', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.LOGIN.ALREADY_LOGIN);
				resolve();
			});

			// case: user not found
			await user_emitter2.login('no such user', 'default password', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.LOGIN.USER_NOTFOUND);
				resolve();
			});

			await user_emitter2.login('default user', 'wrong password', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.LOGIN.PASSWORD_ERROR);
				resolve();
			});
		});
	});

	describe('#logout()', function() {
		it('should response REJECT', async function() {
			this.timeout(50000);
			// case: no login
			await user_emitter2.logout(function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.LOGOUT.NO_LOGIN);
				resolve();
			});
		});

		it('should response OK', async function() {
			this.timeout(50000);
			// case: perform well when logout logined user
			await user_emitter1.logout(function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});
	});

	describe('#double_login', function() {
		it('should fire a hint.', async function() {
			this.timeout(5000);

			await user_emitter1.login('default user', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			await user_emitter2.login('default user', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			await sleep(2000);

			expect(g_hint).to.eql(REASON.LOGOUT.DEVICE_CHANGE);
		});
	});

	describe('#offline_logout', function() {
		it('should logout fail.', async function() {
			this.timeout(5000);

			socket2.close();
			socket2.open();
			await user_emitter2.logout(function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.LOGOUT.NO_LOGIN);
				resolve();
			});

			await user_emitter1.login('default user', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});
	});

	after(function() {
		server.close();
	});
});
