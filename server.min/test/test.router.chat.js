/**
 * Module dependencies
 */
const expect = require('expect.js');
const axios = require('axios').default;
const ChatRequester = require('../suite/requester/requester.chat');
const { PORT, AXIOS: { HOST: HOST }, REASON } = require('../constant');
const server = require('../server');

// activates server
server.listen(PORT);

// sets default base URL
axios.defaults.baseURL = `${HOST}:${PORT}`;

// builds a user requester
const chat_requester = new ChatRequester();

// binds axios to the user requester
chat_requester.bindAxios(axios);

describe('Chat', function() {
	describe('#getChatList()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await chat_requester.getChatList()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 200', async function() {
			this.timeout(50000);
			// case: perform well when new user
			await chat_requester.getChatList('test_user')
			.then(response => {
				expect(response.status).to.eql(200);
				expect(response.data).to.eql([]);
			});
		});
	});

	describe('#getHistory()', function() {
		it('should response 400', async function() {
			this.timeout(50000);
			// case: all undefined
			await chat_requester.getHistory()
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: friend and time undefined
			await chat_requester.getHistory('test_user')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: time undefined
			await chat_requester.getHistory('test_user1', 'test_user2')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});

			// case: time type error
			await chat_requester.getHistory('test_user1', 'test_user2', 'qm0712')
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(400);
			});
		});

		it('should response 409', async function() {
			this.timeout(50000);

			await chat_requester.getHistory('test_user', 'test_user', new Date().getTime())
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(409);
				expect(error.response.data).to.eql(REASON.GET_HISTORY.SAME_USER);
			});

			await chat_requester.getHistory('test_user1', 'test_user2', new Date().getTime())
			.then(response => { throw new Error('should not succeed'); })
			.catch(error => {
				expect(error.response.status).to.eql(409);
				expect(error.response.data).to.eql(REASON.GET_HISTORY.NOT_FRIENDS);
			});
		});
	});

	after(function() {
		server.close();
	});
});
