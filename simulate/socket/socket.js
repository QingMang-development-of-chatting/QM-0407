/**
 * Module dependencies
 */
const server = require('socket.io')();
const UserHandler = require('./handler.user');
const FriendHandler = require('./handler.friend');
const ChatHandler = require('./handler.chat');

server.on('connection', socket => {
	// builds a user event handler
	const user_handler = new UserHandler();
	user_handler.bindSocket(socket);
	user_handler.onLogin();
	user_handler.onLogout();
	user_handler.onDisconnect();

	// builds a chat event handler
	const friend_handler = new FriendHandler();
	friend_handler.bindSocket(socket);
	friend_handler.onSendApply();
	friend_handler.onResponseAccess();
	friend_handler.onSendDelete();
	friend_handler.onDisconnect();

	// builds a chat event handler
	const chat_handler = new ChatHandler();
	chat_handler.bindSocket(socket);
	chat_handler.onSendMessage();
	chat_handler.onSendReadMessage();
	chat_handler.onDisconnect();
});

/**
 * Expose `server`
 */
module.exports = server;
