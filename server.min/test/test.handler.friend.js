/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const io = require('socket.io-client');
const UserRequester = require('../suite/requester/requester.user');
const FriendRequester = require('../suite/requester/requester.friend');
const UserEmitter = require('../suite/emitter/emitter.user');
const FriendEmitter = require('../suite/emitter/emitter.friend');
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

// binds axios to the requesters
user_requester.bindAxios(axios);
friend_requester.bindAxios(axios);

// builds emitters
const user_emitter1 = new UserEmitter();
const user_emitter2 = new UserEmitter();
const friend_emitter1 = new FriendEmitter();
const friend_emitter2 = new FriendEmitter();

// binds socket to the user emitters
user_emitter1.bindSocket(socket1);
user_emitter2.bindSocket(socket2);
friend_emitter1.bindSocket(socket1);
friend_emitter2.bindSocket(socket2);

let g_applicant = null;
friend_emitter1.listenReceiveApply(function(applicant) {
	g_applicant = applicant;
});
let g_responser = null;
friend_emitter2.listenReceiveAccessd(function(responser) {
	g_responser = responser;
});
let g_friend = null;
friend_emitter2.listenReceiveDeleted(function(friend) {
	g_friend = friend;
});

describe('Friend', function() {
	describe('#register()', function() {
		it('should response 201', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await user_requester.register('test_user1', 'default password', 'nickname')
			.then(response => {
				expect(response.status).to.eql(201);
			});
			// case: perform well when new user
			await user_requester.register('test_user2', 'default password', 'nickname')
			.then(response => {
				expect(response.status).to.eql(201);
			});
		});
	});

	describe('#sendApply()', function() {
		it('should response BAD PARAM', async function() {
			this.timeout(50000);
			// case: type error
			await friend_emitter2.sendApply(1, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			await friend_emitter2.sendApply('test_user1', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.SEND_APPLY.NO_LOGIN);
				resolve();
			});

			// logins
			await user_emitter2.login('test_user2', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			// logins
			await user_emitter1.login('test_user1', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			// same user
			await friend_emitter2.sendApply('test_user2', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.SEND_APPLY.SAME_USER);
				resolve();
			});
		});

		it('should response OK', async function() {
			this.timeout(50000);
			await friend_emitter2.sendApply('test_user1', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});

		it('should receive notification', async function() {
			this.timeout(50000);
			await sleep(2000);
			expect(g_applicant).to.eql('test_user2');

			await friend_requester.getApplicants('test_user1')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql([{sender: 'test_user2', type: NOTIFICATION.TYPE.APPLY}]);
			});
		});
	});

	describe('#responseAccess()', function() {
		it('should response BAD PARAM', async function() {
			this.timeout(50000);
			// case: type error
			await friend_emitter1.responseAccess(1, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			// logouts
			await user_emitter1.logout(function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			await friend_emitter1.responseAccess('test_user1', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.ACCESS.NO_LOGIN);
				resolve();
			});

			// logins
			await user_emitter1.login('test_user1', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			// same user
			await friend_emitter1.responseAccess('test_user1', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.ACCESS.SAME_USER);
				resolve();
			});

			// no such applicants
			await friend_emitter1.responseAccess('no such user', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.ACCESS.NO_SUCH_APLLICANT);
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

		it('should receive notification', async function() {
			this.timeout(50000);
			await sleep(2000);
			expect(g_responser).to.eql('test_user1');

			await friend_requester.getApplicants('test_user1')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql([{sender: 'test_user2', type: NOTIFICATION.TYPE.ACCESS}]);
			});

			await friend_requester.getFriends('test_user1')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql(['test_user2']);
			});

			await friend_requester.getFriends('test_user2')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql(['test_user1']);
			});
		});
	});

	describe('#sendDelete()', function() {
		it('should response BAD PARAM', async function() {
			this.timeout(50000);
			// case: type error
			await friend_emitter1.sendDelete(1, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.BAD_PARAM);
				resolve();
			});
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			// logouts
			await user_emitter1.logout(function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			await friend_emitter1.sendDelete('test_user1', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.ACCESS.NO_LOGIN);
				resolve();
			});

			// logins
			await user_emitter1.login('test_user1', 'default password', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			// same user
			await friend_emitter1.sendDelete('test_user1', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.ACCESS.SAME_USER);
				resolve();
			});

			// no such applicants
			await friend_emitter1.sendDelete('no such user', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.ACCESS.NO_SUCH_APLLICANT);
				resolve();
			});
		});

		it('should response OK', async function() {
			this.timeout(50000);
			await friend_emitter1.sendDelete('test_user2', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});
		});

		it('should receive notification', async function() {
			this.timeout(50000);
			await sleep(2000);
			expect(g_friend).to.eql('test_user1');

			await friend_requester.getFriends('test_user1')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql([]);
			});

			await friend_requester.getFriends('test_user2')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql([]);
			});
		});
	});

	describe('#rejectApplicant()', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			await friend_emitter2.sendApply('test_user1', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			await friend_requester.rejectApplicant('test_user1', 'test_user2')
			.then(response => {
				expect(response.status).to.eql(200);
			});
		});
	});

	describe('#sendApply()', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			await friend_emitter2.sendApply('test_user1', function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});

			g_responser = null;

			await friend_emitter1.sendApply('test_user2', function({status, reason}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.REJECT);
				expect(reason).to.eql(REASON.FRIEND.SEND_APPLY.MULT_ROLES);
				resolve();
			});

			await sleep(2000);
			expect(g_responser).to.eql('test_user1');
		});
	});

	after(function() {
		socket1.close();
		socket2.close();
		server.close();
	});
});
