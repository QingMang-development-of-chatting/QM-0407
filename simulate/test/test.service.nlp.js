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
const NLPService = require('../simulate/service.nlp');

const user_service = new UserService();
const friend_service = new FriendService();
const chat_service = new ChatService();
const nlp_service = new NLPService();

describe('Chat', function() {
	describe('#register...', async function() {
		it('should response OK for three new users', async function() {
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

	describe('#messages_less_than_20', async function() {
		it('should response OK', async function() {
			this.timeout(120000);
			let i = 0;
			while (i < 10) {
				const message = {
					sender: 'test_user1',
					receiver: 'test_user2',
					text: `获取时保证顺序就得获取全部消息再进行类似排序的工序了`,
					time: new Date().getTime()
				};
				i++;
				const result = await chat_service.addMessage(message);
				expect(result.status).to.eql(STATUS.OK);
			}
		});

		it('should receiver REJECT for few messages', async function() {
			this.timeout(120000);
			const result = await nlp_service.cloud('test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.CLOUD.FEW);
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
					text: `获取时保证顺序就得获取全部消息再进行类似排序的工序了`,
					time: new Date().getTime()
				};
				i++;
				const result = await chat_service.addMessage(message);
				expect(result.status).to.eql(STATUS.OK);
			}
		});

		it('should response OK', async function() {
			this.timeout(120000);
			let i = 0;
			while (i < 20) {
				const message = {
					sender: 'test_user1',
					receiver: 'test_user3',
					text: `增加：Yunic：会方便点吧，如果做不到的话，就需要获取所有消息然后挑大的这样？」
					service要拿全部消息？
					因为需求和时间顺序相关，所以要不插入时保证顺序，要不就获取时保证顺序咯`,
					time: new Date().getTime()
				};
				i++;
				const result = await chat_service.addMessage(message);
				expect(result.status).to.eql(STATUS.OK);
			}
		});
	});

	describe('#cloud()', function() {
		it('should receive OK', async function() {
			this.timeout(120000);
			const result = await nlp_service.cloud('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.be.a('string');
		});
	});
});
