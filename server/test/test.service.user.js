/**
 * Module dependencies
 */
const expect = require('expect.js');
const { SERVICE: { STATUS: STATUS }, REASON } = require('../constant');
const UserService = require('../service/service.user');

const user_service = new UserService();

describe('User', function() {
	describe('#register()', function() {
		it('should response REJECT for type error', async function() {

		});

		it('should response OK', async function() {
			// creates a new user called `test_user`
			const result = await user_service.register('test_user', 'test_password', 'test_nickname');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT for user duplicate', async function() {
			// the user called `test_user` is occupied
			const result = await user_service.register('test_user', 'test_password', 'test_nickname');
			expect(result.status).to.eql(STATUS.REJECT);
			expect(result.reason).to.eql(REASON.REGISTER.USER_DUPLICATE);
		});
	});

	describe('#isValid()', function() {
		it('should response NOT FOUND', async function() {
			// the user called `test_none` should not be created
			const result = await user_service.isValid('test_none', 'test_password', 'test_nickname');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK', async function() {
			const result = await user_service.isValid('test_user', 'test_password');
			expect(result.status).to.eql(STATUS.OK);
		});

		it('should response REJECT', async function() {
			const result = await user_service.isValid('test_user', 'test_error', 'test_nickname');
			expect(result.status).to.eql(STATUS.REJECT);
		});
	});

	describe('#getInfo()', function() {
		it('should response NOT FOUND', async function() {
			// the user called `test_none` should not be created
			const result = await user_service.getInfo('test_none');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK with correct data', async function() {
			const result = await user_service.getInfo('test_user');
			expect(result.status).to.eql(STATUS.OK);

			// expects photo is `''`, for no setPhoto() before
			expect(result.data).to.eql({username: 'test_user', nickname: 'test_nickname', photo: ''});
		});
	});

	describe('#setPassword()', function() {
		it('should response REJECT for type error', async function() {

		});

		it('should response NOT FOUND', async function() {
			// the user called `test_none` should not be created
			const result = await user_service.setPassword('test_none', 'test_password_new');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK and receive correct data', async function() {
			// sets new password
			const result_set_password = await user_service.setPassword('test_user', 'test_password_new');
			expect(result_set_password.status).to.eql(STATUS.OK);

			// checks if vaild
			const result_is_valid1 = await user_service.isValid('test_user', 'test_password');
			expect(result_is_valid1.status).to.eql(STATUS.REJECT);
			const result_is_valid2 = await user_service.isValid('test_user', 'test_password_new');
			expect(result_is_valid2.status).to.eql(STATUS.OK);
		});
	});

	describe('#setNickname()', function() {
		it('should response REJECT for type error', async function() {

		});

		it('should response NOT FOUND', async function() {
			// the user called `test_none` should not be created
			const result = await user_service.setNickname('test_none', 'test_nickname_new');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK and receive correct data', async function() {
			// sets new password
			const result = await user_service.setNickname('test_user', 'test_nickname_new');
			expect(result.status).to.eql(STATUS.OK);
			// checks if vaild
			const { data: { nickname: nickname } } = await user_service.getInfo('test_user');
			expect(nickname).to.eql('test_nickname_new');
		});
	});

	describe('#setPhoto()', function() {
		it('should response REJECT for type error', async function() {

		});

		it('should response NOT FOUND', async function() {
			// the user called `test_none` should not be created
			const result = await user_service.setPhoto('test_none', '#!@$%^');
			expect(result.status).to.eql(STATUS.NOT_FOUND);
		});

		it('should response OK and receive correct data', async function() {
			// sets new password
			const result = await user_service.setPhoto('test_user', '#!@$%^');
			expect(result.status).to.eql(STATUS.OK);
			// checks if vaild
			const { data: { photo: photo } } = await user_service.getInfo('test_user');
			expect(photo).to.eql('#!@$%^');
		});
	});

});