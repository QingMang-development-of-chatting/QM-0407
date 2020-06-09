/**
 * Module dependencies
 */
const UserService = require('./service.user');
const FriendService = require('./service.friend');
const ChatService = require('./service.chat');
const NLPService = require('./service.nlp');
const { SERVICE: { STATUS: STATUS } } = require('../constant');

/**
 * Expose services
 */
module.exports = {
	UserService: UserService,
	FriendService: FriendService,
	ChatService: ChatService,
	NLPService: NLPService
}
