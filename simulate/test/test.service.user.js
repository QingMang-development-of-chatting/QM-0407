/**
 * Warning:
 * 
 *   This test requires there is no user called `test_user` or `test_none` in databse.
 *   This test will create a user called `test_user` in database.
 */

/**
 * Module dependencies
 */
const expect = require('expect.js');
const { SERVICE: { STATUS: STATUS }, REASON } = require('../constant');
const UserService = require('../simulate/service.user');

const user_service = new UserService();

describe('User', function() {
	describe('#register()', function() {
		it('should response REJECT for type error', async function() {
			this.timeout(50000);
			// username too short
			const result_username_too_short = await user_service.register('12', 'test_password', 'test_nickname');
			expect(result_username_too_short.status).to.eql(STATUS.REJECT);
			expect(result_username_too_short.reason).to.eql(REASON.REGISTER.USERNAME_ERROR);

			// username too long
			const result_username_too_long = await user_service.register('1234567890123456', 'test_password', 'test_nickname');
			expect(result_username_too_long.status).to.eql(STATUS.REJECT);
			expect(result_username_too_long.reason).to.eql(REASON.REGISTER.USERNAME_ERROR);

			// username with characters deposed
			const result_username_char = await user_service.register('#123', 'test_password', 'test_nickname');
			expect(result_username_char.status).to.eql(STATUS.REJECT);
			expect(result_username_char.reason).to.eql(REASON.REGISTER.USERNAME_ERROR);

			// password too short
			const result_password_too_short = await user_service.register('123456789012345', '1234567', 'test_nickname');
			expect(result_password_too_short.status).to.eql(STATUS.REJECT);
			expect(result_password_too_short.reason).to.eql(REASON.REGISTER.PASSWORD_ERROR);

			// empty nickname
			const result_nickname_empty = await user_service.register('123', '12345678', '');
			expect(result_nickname_empty.status).to.eql(STATUS.REJECT);
			expect(result_nickname_empty.reason).to.eql(REASON.REGISTER.NICKNAME_ERROR);

			// all error
			const result_all_error = await user_service.register('12', '1234567', '');
			expect(result_all_error.status).to.eql(STATUS.REJECT);
			expect(result_all_error.reason).to.eql(
				REASON.REGISTER.USERNAME_ERROR | REASON.REGISTER.PASSWORD_ERROR | REASON.REGISTER.NICKNAME_ERROR);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			// creates a new user called `test_user`
			const result = await user_service.register('test_user', 'test_password', 'test_nickname');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT for user duplicate', async function() {
			this.timeout(50000);
			// the user called `test_user` is occupied
			const result = await user_service.register('test_user', 'test_password', 'test_nickname');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.REGISTER.USER_DUPLICATE);
		});
	});

	describe('#isValid()', function() {
		it('should response NOT FOUND', async function() {
			this.timeout(50000);
			// the user called `test_none` should not be created
			const result = await user_service.isValid('test_none', 'test_password', 'test_nickname');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK', async function() {
			this.timeout(50000);
			const result = await user_service.isValid('test_user', 'test_password');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT', async function() {
			this.timeout(50000);
			const result = await user_service.isValid('test_user', 'test_error', 'test_nickname');
			expect(result.status).to.eql(STATUS.REJECT);
		});
	});

	describe('#getInfo()', function() {
		it('should response NOT FOUND', async function() {
			this.timeout(50000);
			// the user called `test_none` should not be created
			const result = await user_service.getInfo('test_none');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK with correct data', async function() {
			this.timeout(50000);
			const result = await user_service.getInfo('test_user');
			expect(result.status).to.eql(STATUS.OK);

			// expects photo is `''`, for no setPhoto() before
			expect(result.data).to.eql({username: 'test_user', nickname: 'test_nickname', photo: ''});
		});
	});

	describe('#setPassword()', function() {
		it('should response REJECT for type error', async function() {
			this.timeout(50000);
			const result_password_too_short = await user_service.setPassword('test_user', '1234567');
			expect(result_password_too_short.status).to.eql(STATUS.REJECT);
			expect(result_password_too_short.reason).to.eql(REASON.USERINFO.PASSWORD_ERROR);
		});

		it('should response NOT FOUND', async function() {
			this.timeout(50000);
			// the user called `test_none` should not be created
			const result = await user_service.setPassword('test_none', 'test_password_new');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK and receive correct data', async function() {
			this.timeout(50000);
			// sets new password
			const result_set_password = await user_service.setPassword('test_user', '12345678');
			expect(result_set_password.status).to.eql(STATUS.OK);

			// checks if vaild
			const result_is_valid1 = await user_service.isValid('test_user', 'test_password');
			expect(result_is_valid1.status).to.eql(STATUS.REJECT);
			const result_is_valid2 = await user_service.isValid('test_user', '12345678');
			expect(result_is_valid2.status).to.eql(STATUS.OK);
		});
	});

	describe('#setNickname()', function() {
		it('should response REJECT for type error', async function() {
			this.timeout(50000);
			const result = await user_service.setNickname('test_user', '');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.USERINFO.NICKNAME_ERROR);
		});

		it('should response NOT FOUND', async function() {
			this.timeout(50000);
			// the user called `test_none` should not be created
			const result = await user_service.setNickname('test_none', 'test_nickname_new');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK and receive correct data', async function() {
			this.timeout(50000);
			// sets new nickname
			const result = await user_service.setNickname('test_user', 'test_nickname_new');
			expect(result.status).to.eql(STATUS.OK);
			// checks if vaild
			const { data: { nickname: nickname } } = await user_service.getInfo('test_user');
			expect(nickname).to.eql('test_nickname_new');
		});
	});

	describe('#setPhoto()', function() {
		it('should response NOT FOUND', async function() {
			this.timeout(50000);
			// the user called `test_none` should not be created
			const result = await user_service.setPhoto('test_none', '#!@$%^');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK and receive correct data', async function() {
			this.timeout(50000);
			// sets new photo
			const result = await user_service.setPhoto('test_user', '#!@$%^');
			expect(result.status).to.eql(STATUS.OK);
			// checks if vaild
			const { data: { photo: photo } } = await user_service.getInfo('test_user');
			expect(photo).to.eql('#!@$%^');
		});
	});

});