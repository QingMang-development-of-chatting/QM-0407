/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const FriendRequester = require('../suite/requester/requester.friend');
const { PORT, AXIOS: { HOST: HOST }, REASON } = require('../constant');
const server = require('../server');

// activates server
server.listen(PORT);

// sets default base URL
axios.defaults.baseURL = `${HOST}:${PORT}`;

// builds requesters
const friend_requester = new FriendRequester();

// binds axios to the requesters
friend_requester.bindAxios(axios);

describe('Friend', function() {
	describe('#getFriends()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await friend_requester.getFriends()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 200', async function() {
			this.timeout(50000);
			// case: all undefined
			await friend_requester.getFriends('default user')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql([]);
			});
		});
	});

	describe('#rejectApplicant()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await friend_requester.rejectApplicant()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: applicant undefined
			await friend_requester.rejectApplicant('default user')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 409', async function() {
			this.timeout(50000);
			// case: all undefined
			await friend_requester.rejectApplicant('default user', 'applicant1')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(409);
				expect(error.response.data).to.eql(REASON.FRIEND.REJECT.NO_SUCH_APLLICANT);
			});
		});
	});

	describe('#getApplicants()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await friend_requester.getApplicants()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 200', async function() {
			this.timeout(50000);
			
			await friend_requester.getApplicants('default user')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql([]);
			});
		});
	});

	after(function() {
		server.close();
	});
});
