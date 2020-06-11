/**
 * Module dependencies
 */
const UserService = require('./service.user');
const FriendService = require('./service.friend');
const ChatService = require('./service.chat');
const NLPService = require('./service.nlp');

// builds a user service
const user_service = new UserService();

// builds a friend service
const friend_service = new FriendService();

// builds a chat service
const chat_service = new ChatService();

// builds a nlp service
const nlp_service = new NLPService();

/**
 * Expose services
 */
module.exports = {
	user_service: user_service,
	friend_service: friend_service,
	chat_service: chat_service,
	nlp_service: nlp_service
}
