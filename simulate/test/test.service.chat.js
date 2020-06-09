/**
 * Warning:
 * 
 *   This test requires there is no user called `test_user1`, `test_user2` or `test_user3` in databse.
 *   This test will create a user called `test_user1`, `test_user2` and `test_user3` in database.
 */

/**
 * Module dependencies
 */
const expect = require('expect.js');
const { NOTIFICATION, SERVICE: { STATUS: STATUS }, REASON } = require('../constant');
const UserService = require('../simulate/service.user');
const FriendService = require('../simulate/service.friend');
const ChatService = require('../simulate/service.chat');

const user_service = new UserService();
const friend_service = new FriendService();
const chat_service = new ChatService();

const g_user1_user2 = {};
g_user1_user2.history = [];
const g_user1_user3 = {};
g_user1_user3.history = [];

describe('Chat', function() {
	describe('#register...', async function() {
		it('should response OK for tow new users', async function() {
			this.timeout(50000);
			const result_user1 = await user_service.register('test_user1', 'default password', 'user1');
			expect(result_user1.status).to.eql(STATUS.OK);
			const result_user2 = await user_service.register('test_user2', 'default password', 'user2');
			expect(result_user2.status).to.eql(STATUS.OK);
			const result_user3 = await user_service.register('test_user3', 'default password', 'user3');
			expect(result_user3.status).to.eql(STATUS.OK);
		});
	});

	describe('#make_friends...', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.applyUserToBeFriend('test_user2', 'test_user1');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.applyUserToBeFriend('test_user3', 'test_user1');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.accessUserToBeFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.accessUserToBeFriend('test_user1', 'test_user3');
			expect(result.status).to.eql(STATUS.OK);
		});
	});

	describe('#getRecentChatList()', async function() {
		it('should response not found', async function() {
			this.timeout(50000);
			const result = await chat_service.getRecentChatList('test_user1');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});
	});

	describe('#getMessages()', async function() {
		it('should response REJECT for same user', async function() {
			this.timeout(50000);
			const result = await chat_service.getMessages('test_user1', 'test_user1', new Date().getTime());
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.GET_HISTORY.SAME_USER);
		});

		it('should response REJECT for not friends', async function() {
			this.timeout(50000);
			const result = await chat_service.getMessages('test_user2', 'test_user3', new Date().getTime());
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.GET_HISTORY.NOT_FRIENDS);
		});

		it('should response OK and data is an empty array', async function() {
			const result = await chat_service.getMessages('test_user1', 'test_user2', new Date().getTime());
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([]);
		});
	});

	describe('#addMessage()', async function() {
		it('should response REJECT for same user', async function() {
			this.timeout(50000);
			const message = {
				sender: 'test_user1',
				receiver: 'test_user1',
				text: 'default text',
				time: new Date().getTime()
			};
			const result = await chat_service.addMessage(message);
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.SEND_MESSAGE.SAME_USER);
		});

		it('should response REJECT for not friends', async function() {
			this.timeout(50000);
			const message = {
				sender: 'test_user2',
				receiver: 'test_user3',
				text: 'default text',
				time: new Date().getTime()
			};
			const result = await chat_service.addMessage(message);
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.SEND_MESSAGE.NOT_FRIENDS);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const message = {
				sender: 'test_user1',
				receiver: 'test_user2',
				text: '色情',
				time: new Date().getTime()
			};
			g_user1_user2.last_message = message;
			g_user1_user2.last_message.text = '*情';
			g_user1_user2.history.push(message);
			const result = await chat_service.addMessage(message);
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data.text).to.eql('*情');
			expect(result.data.sentiment).to.be.a('number');
		});
	});

	describe('#getRecentChatList()', async function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await chat_service.getRecentChatList('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([
				{
					friend: 'test_user2',
					last_text: g_user1_user2.last_message.text,
					last_time: g_user1_user2.last_message.time,
					unread_cnt: 1,
					sender: g_user1_user2.last_message.sender
				}
			]);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await chat_service.getRecentChatList('test_user2');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([
				{
					friend: 'test_user1',
					last_text: g_user1_user2.last_message.text,
					last_time: g_user1_user2.last_message.time,
					unread_cnt: 1,
					sender: g_user1_user2.last_message.sender
				}
			]);
		});
	});

	describe('#getMessages()', async function() {
		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await chat_service.getMessages('test_user1', 'test_user2', new Date().getTime());
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data.map(message => {
				const {sender, text, time, is_read} = message;
				return {sender, text, time, is_read};
			})).to.eql([
				{
					sender: g_user1_user2.last_message.sender,
					text: g_user1_user2.last_message.text,
					time: g_user1_user2.last_message.time,
					is_read: false
				}
			]);
		});
	});

	describe('#addMessage()', async function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const message = {
				sender: 'test_user1',
				receiver: 'test_user2',
				text: 'Hello?',
				time: new Date().getTime()
			};
			g_user1_user2.last_message = message;
			g_user1_user2.history.push(message);
			const result = await chat_service.addMessage(message);
			expect(result.status).to.eql(STATUS.OK);
		});
	});

	describe('#getRecentChatList()', async function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await chat_service.getRecentChatList('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([
				{
					friend: 'test_user2',
					last_text: g_user1_user2.last_message.text,
					last_time: g_user1_user2.last_message.time,
					unread_cnt: 2,
					sender: g_user1_user2.last_message.sender
				}
			]);
		});
	});

	describe('#getMessages()', async function() {
		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await chat_service.getMessages('test_user1', 'test_user2', new Date().getTime());
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data.map(message => {
				const {sender, text, time, is_read} = message;
				return {sender, text, time, is_read};
			})).to.eql(g_user1_user2.history.map(function(message) {
				const {sender, text, time} = message;
				return {sender, text, time, is_read:false} 
			}));
		});
	});

	describe('#readMessage()', async function() {
		it('should response REJECT for same user', async function() {
			this.timeout(50000);
			const result = await chat_service.readMessage('test_user1', 'test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.SEND_READ_MESSAGE.SAME_USER);
		});

		it('should response REJECT for not friends', async function() {
			this.timeout(50000);
			const result = await chat_service.readMessage('test_user2', 'test_user3');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.SEND_READ_MESSAGE.NOT_FRIENDS);
		});

		it('should response REJECT for no update', async function() {
			this.timeout(50000);
			const result = await chat_service.readMessage('test_user2', 'test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.SEND_READ_MESSAGE.NO_UPDATE);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await chat_service.readMessage('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT for no update', async function() {
			this.timeout(50000);
			const result = await chat_service.readMessage('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.SEND_READ_MESSAGE.NO_UPDATE);
		});
	});

	describe('#getMessages()', async function() {
		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await chat_service.getMessages('test_user1', 'test_user2', new Date().getTime());
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data.map(message => {
				const {sender, text, time, is_read} = message;
				return {sender, text, time, is_read};
			})).to.eql(g_user1_user2.history.map(function(message) {
				const {sender, text, time} = message;
				return {sender, text, time, is_read:true} 
			}));
		});
	});

	describe('#getRecentChatList()', async function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await chat_service.getRecentChatList('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([
				{
					friend: 'test_user2',
					last_text: g_user1_user2.last_message.text,
					last_time: g_user1_user2.last_message.time,
					unread_cnt: 0,
					sender: g_user1_user2.last_message.sender
				}
			]);
		});
	});

	describe('#addMessage()', async function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const message = {
				sender: 'test_user1',
				receiver: 'test_user3',
				text: 'Hello?',
				time: new Date().getTime()
			};
			g_user1_user3.last_message = message;
			g_user1_user3.history.push(message);
			const result = await chat_service.addMessage(message);
			expect(result.status).to.eql(STATUS.OK);
		});
	});

	describe('#getRecentChatList()', async function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await chat_service.getRecentChatList('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([
				{
					friend: 'test_user3',
					last_text: g_user1_user3.last_message.text,
					last_time: g_user1_user3.last_message.time,
					unread_cnt: 1,
					sender: g_user1_user3.last_message.sender
				},
				{
					friend: 'test_user2',
					last_text: g_user1_user2.last_message.text,
					last_time: g_user1_user2.last_message.time,
					unread_cnt: 0,
					sender: g_user1_user2.last_message.sender
				}
			]);
		});
	});

	describe('#multiple_messages', async function() {
		it('should response OK', async function() {
			this.timeout(120000);
			let i = 0;
			while (i < 20) {
				const message = {
					sender: 'test_user1',
					receiver: 'test_user2',
					text: `${i}`,
					time: new Date().getTime()
				};
				i++;
				g_user1_user2.last_message = message;
				g_user1_user2.history.push(message);
				const result = await chat_service.addMessage(message);
				expect(result.status).to.eql(STATUS.OK);
			}
			const result_chatlist = await chat_service.getRecentChatList('test_user1');
			expect(result_chatlist.status).to.eql(STATUS.OK);
			expect(result_chatlist.data).to.eql([
				{
					friend: 'test_user2',
					last_text: g_user1_user2.last_message.text,
					last_time: g_user1_user2.last_message.time,
					unread_cnt: 20,
					sender: g_user1_user2.last_message.sender
				},
				{
					friend: 'test_user3',
					last_text: g_user1_user3.last_message.text,
					last_time: g_user1_user3.last_message.time,
					unread_cnt: 1,
					sender: g_user1_user3.last_message.sender
				}
			]);
			const result_getmessages = await chat_service.getMessages('test_user1', 'test_user2', new Date().getTime());
			expect(result_getmessages.status).to.eql(STATUS.OK);
			expect(result_getmessages.data.length).to.eql(20);
		});


	});

});
