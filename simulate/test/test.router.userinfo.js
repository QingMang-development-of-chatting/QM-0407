/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const UserRequester = require('../suite/requester/requester.user');
const UserInfoRequester = require('../suite/requester/requester.userinfo');
const { PORT, AXIOS: { HOST: HOST }, REASON } = require('../constant');
const server = require('../server');

// activates server
server.listen(PORT);

// sets default base URL
axios.defaults.baseURL = `${HOST}:${PORT}`;

// builds requesters
const user_requester = new UserRequester();
const userinfo_requester = new UserInfoRequester();

// binds axios to the requesters
user_requester.bindAxios(axios);
userinfo_requester.bindAxios(axios);

// registers a default user before tests
user_requester.register('default user', 'default password', 'default nickname');

describe('UserInfo', function() {
	describe('#getInfo()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await userinfo_requester.getInfo()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 200', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await userinfo_requester.getInfo('default user')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql({ username: 'default user', nickname: 'default nickname', photo: '' });
			});
		});

		it('should response 404', async function() {
			this.timeout(50000);
			// case: user duplicate
			await userinfo_requester.getInfo('no such user')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(404);
			});
		});
	});

	describe('#setPassword()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await userinfo_requester.setPassword()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: undefined password
			await userinfo_requester.setPassword()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: type error
			await userinfo_requester.setPassword('default user', 1)
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 200', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await userinfo_requester.setPassword('default user', 'new password')
			.then(response => {
				expect(response.status).to.eql(200);
			});
		});

		it('should response 404', async function() {
			this.timeout(50000);
			// case: user duplicate
			await userinfo_requester.setPassword('no such user', 'new password')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(404);
			});
		});
	});

	describe('#setNickname()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await userinfo_requester.setNickname()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: undefined password
			await userinfo_requester.setNickname()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: type error
			await userinfo_requester.setNickname('default user', 1)
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 200', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await userinfo_requester.setNickname('default user', 'new nickname')
			.then(response => {
				expect(response.status).to.eql(200);
			});

			await userinfo_requester.getInfo('default user')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql({ username: 'default user', nickname: 'new nickname', photo: '' });
			});
		});

		it('should response 404', async function() {
			this.timeout(50000);
			// case: user duplicate
			await userinfo_requester.setNickname('no such user', 'new nickname')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(404);
			});
		});
	});

	describe('#setPhoto()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await userinfo_requester.setPhoto()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: undefined password
			await userinfo_requester.setPhoto()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: type error
			await userinfo_requester.setPhoto('default user', 1)
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 200', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await userinfo_requester.setPhoto('default user', 'default photo')
			.then(response => {
				expect(response.status).to.eql(200);
			});

			await userinfo_requester.getInfo('default user')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql({ username: 'default user', nickname: 'new nickname', photo: 'default photo' });
			});
		});

		it('should response 404', async function() {
			this.timeout(50000);
			// case: user duplicate
			await userinfo_requester.setPhoto('no such user', 'default photo')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(404);
			});
		});
	});

	after(function() {
		server.close();
	});
});
