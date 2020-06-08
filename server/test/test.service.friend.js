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
const UserService = require('../service/service.user');
const FriendService = require('../service/service.friend');

const user_service = new UserService();
const friend_service = new FriendService();

describe('Friend', function() {
	describe('#register...', function() {
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

	describe('#getFriends()', function() {
		it('should response OK and data is an empty array', async function() {
			this.timeout(50000);
			const result = await friend_service.getFriends('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([]);
		});
	});

	describe('#getNotification()', function() {
		it('should response OK and data is an empty array', async function() {
			this.timeout(50000);
			const result = await friend_service.getNotification('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([]);
		});
	});

	describe('#accessUserToBeFriend()', function() {
		it('should response REJECT for the same user', async function() {
			this.timeout(50000);
			const result = await friend_service.accessUserToBeFriend('test_user1', 'test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.ACCESS.SAME_USER);
		});

		it('should response REJECT for no such apllicant', async function() {
			this.timeout(50000);
			const result = await friend_service.accessUserToBeFriend('test_user1', 'test_user3');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.ACCESS.NO_SUCH_APLLICANT);
		});
	});

	describe('#rejectUserToBeFriend()', function() {
		it('should response REJECT for the same user', async function() {
			this.timeout(50000);
			const result = await friend_service.rejectUserToBeFriend('test_user1', 'test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.REJECT.SAME_USER);
		});

		it('should response REJECT for no such apllicant', async function() {
			this.timeout(50000);
			const result = await friend_service.rejectUserToBeFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.REJECT.NO_SUCH_APLLICANT);
		});
	});

	describe('#applyUserToBeFriend()', function() {
		it('should response REJECT for the same user', async function() {
			this.timeout(50000);
			const result = await friend_service.applyUserToBeFriend('test_user1', 'test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.SEND_APPLY.SAME_USER);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.applyUserToBeFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT for resent', async function() {
			this.timeout(50000);
			const result = await friend_service.applyUserToBeFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.SEND_APPLY.RESENT);
		});
	});

	describe('#getNotification()', function() {
		it('should response OK and data is packed with one notification', async function() {
			this.timeout(50000);
			const result = await friend_service.getNotification('test_user2');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([{sender: 'test_user1', type: NOTIFICATION.TYPE.APPLY}]);
		});
	});

	describe('#accessUserToBeFriend()', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.accessUserToBeFriend('test_user2', 'test_user1');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			const result = await friend_service.accessUserToBeFriend('test_user2', 'test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.ACCESS.NO_SUCH_APLLICANT);
		});
	});

	describe('#getNotification()', function() {
		it('should response OK and data is packed with one notification', async function() {
			this.timeout(50000);
			const result = await friend_service.getNotification('test_user2');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([{sender: 'test_user1', type: NOTIFICATION.TYPE.ACCESS}]);
		});
	});

	describe('#getFriends()', function() {
		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await friend_service.getFriends('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql(['test_user2']);
		});

		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await friend_service.getFriends('test_user2');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql(['test_user1']);
		});
	});

	describe('#deleteFriend()', function() {
		it('should response REJECT for the same user', async function() {
			this.timeout(50000);
			const result = await friend_service.deleteFriend('test_user1', 'test_user1');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.DELETE.SAME_USER);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.deleteFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT for no such friend', async function() {
			this.timeout(50000);
			const result = await friend_service.deleteFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.DELETE.NO_SUCH_FRIEND);
		});
	});

	describe('#getNotification()', function() {
		it('should response OK and data is an empty array', async function() {
			this.timeout(50000);
			const result = await friend_service.getNotification('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([]);
		});
	});

	describe('#applyUserToBeFriend()', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.applyUserToBeFriend('test_user2', 'test_user1');
			expect(result.status).to.eql(STATUS.OK);
		});
	});

	describe('#getNotification()', function() {
		it('should response OK and data is packed with one notification', async function() {
			this.timeout(50000);
			const result = await friend_service.getNotification('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql([{sender: 'test_user2', type: NOTIFICATION.TYPE.APPLY}]);
		});
	});

	describe('#rejectUserToBeFriend()', function() {
		it('should response OK', async function() {
			this.timeout(50000);
			const result = await friend_service.rejectUserToBeFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			const result = await friend_service.rejectUserToBeFriend('test_user1', 'test_user2');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.FRIEND.REJECT.NO_SUCH_APLLICANT);
		});
	});

	describe('#many friends check()', function() {
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
	});

	describe('#getNotification()', function() {
		it('should response OK and data is packed with two notifications', async function() {
			this.timeout(50000);
			const result = await friend_service.getNotification('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql(
				[
				  {sender: 'test_user3', type: NOTIFICATION.TYPE.APPLY},
				  {sender: 'test_user2', type: NOTIFICATION.TYPE.APPLY},
				]
				);
		});
	});

	describe('#accessUserToBeFriend()', function() {
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

	describe('#getFriends()', function() {
		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await friend_service.getFriends('test_user1');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql(['test_user2', 'test_user3']);
		});

		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await friend_service.getFriends('test_user2');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql(['test_user1']);
		});

		it('should response OK and data is an array', async function() {
			this.timeout(50000);
			const result = await friend_service.getFriends('test_user3');
			expect(result.status).to.eql(STATUS.OK);
			expect(result.data).to.eql(['test_user1']);
		});
	});
});
