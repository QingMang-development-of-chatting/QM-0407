/**
 * Module dependencies
 */
const { UserService, FriendService, ChatService } = require('./service');

// builds a user service
const user_service = new UserService();

// builds a friend service
const friend_service = new FriendService();

// builds a chat service
const chat_service = new ChatService();

/**
 * Expose services
 */
module.exports = {
	user_service: user_service,
	friend_service: friend_service,
	chat_service: chat_service
}
