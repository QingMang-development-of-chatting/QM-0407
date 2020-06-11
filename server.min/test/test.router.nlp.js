/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const io = require('socket.io-client');
const UserRequester = require('../suite/requester/requester.user');
const FriendRequester = require('../suite/requester/requester.friend');
const ChatRequester = require('../suite/requester/requester.chat');
const NLPRequester = require('../suite/requester/requester.nlp');
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
const nlp_requester = new NLPRequester();

// binds axios to the requesters
user_requester.bindAxios(axios);
friend_requester.bindAxios(axios);
chat_requester.bindAxios(axios);
nlp_requester.bindAxios(axios);

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

describe('NLP', function() {
	describe('#register...', function() {
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
		it('should response OK', async function() {
			this.timeout(120000);
			const message = {
				receiver: 'test_user2',
				text: `疫情发生以来，医务处针对疑似患者接诊、确诊患者收入院、康复者复查等不同情况，
				制定了多种应急预案，应急预案的制定是确保医院防疫工作更加有序运行的制度保障。`,
				time: new Date().getTime()
			};
			await chat_emitter1.sendMessage(message, function({status}, resolve) {
				expect(status).to.eql(SOCKET.STATUS.OK);
				resolve();
			});		
		});
	});

	describe('#cloud()', function() {
		it('should response BAD PARAM', async function() {
			this.timeout(50000);
			await nlp_requester.cloud()
			.then(response => { throw new Error('should no succeed')})
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			await nlp_requester.cloud('test_user1')
			.then(response => { throw new Error('should no succeed')})
			.catch(error => {
				expect(error.response.status).to.eql(409);
				expect(error.response.data).to.eql(REASON.CLOUD.FEW);
			});
		});
	});

	describe('#onSendMessage()', function() {
		it('should response OK', async function() {
			this.timeout(120000);
			let i = 0;
			while (i < 20) {
				const message = {
					receiver: 'test_user2',
					text: `疫情发生以来，医务处针对疑似患者接诊、确诊患者收入院、康复者复查等不同情况，
				制定了多种应急预案，应急预案的制定是确保医院防疫工作更加有序运行的制度保障。
				增加：Yunic：会方便点吧，如果做不到的话，就需要获取所有消息然后挑大的这样？」
					service要拿全部消息？
					因为需求和时间顺序相关，所以要不插入时保证顺序，要不就获取时保证顺序咯`,
					time: new Date().getTime()
				};
				i++;
				await chat_emitter1.sendMessage(message, function({status}, resolve) {
					expect(status).to.eql(SOCKET.STATUS.OK);
					resolve();
				});		
			}
		});
	});

	describe('#cloud()', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			await nlp_requester.cloud('test_user1')
			.then(response => {
				expect(response.headers['content-type']).to.eql('image/png');
				expect(response.data).to.be.a('string');
			});
		});
	});

	after(function() {
		socket1.close();
		socket2.close();
		server.close();
	});
});
