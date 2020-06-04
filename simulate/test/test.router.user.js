/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const UserRequester = require('../suite/requester/requester.user');
const { PORT, AXIOS: { HOST: HOST }, REASON } = require('../constant');

// sets default base URL
axios.defaults.baseURL = `${HOST}:${PORT}`;

// builds a user requester
const user_requester = new UserRequester();

// binds axios to the user requester
user_requester.bindAxios(axios);

describe('User', function() {
	describe('#register()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await user_requester.register()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: type error
			await user_requester.register(1, 'default password', 'default nickname')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: type error
			await user_requester.register('default user', 1, 'default nickname')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: type error
			await user_requester.register('default user', 'default password', 1)
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 201', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await user_requester.register('default user', 'default password', 'default nickname')
			.then(response => {
				expect(response.status).to.eql(201);
			});
		});

		it('should response 409', async function() {
			this.timeout(50000);
			// case: user duplicate
			await user_requester.register('default user', 'default password', 'default nickname')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(409);
				expect(error.response.data).to.eql(REASON.REGISTER.USER_DUPLICATE);
			});
		});
	})
});
