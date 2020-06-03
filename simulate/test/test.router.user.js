/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const UserRequester = require('../suite/requester/requester.user');
const { PORT, AXIOS: { HOST: HOST } } = require('../constant');

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
			await request.register()
			.then(response => throw new Error('should not succeed'))
			.catch(error => {
				const { status } = error.response.status;
				expect(status).to.eql(400);
			});

			// case: all undefined
			await request.register()
			.then(response => throw new Error('should not succeed'))
			.catch(error => {
				const { status } = error.response.status;
				expect(status).to.eql(400);
			});

		});
	})
});
