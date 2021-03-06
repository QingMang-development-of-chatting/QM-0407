const Server = require('socket.io');
// const service = require('../service/msgService');

const io = new Server();

const chat = io.of('/chat');

const user_socket = new Map();
const socket_user = new Map();

chat.on('connection', socket => {
	console.log(`${socket.id} connected`);

	socket.on('login', username => {
		let socket_id = user_socket.get(username);
		if (socket_id) {
			socket.to(socket_id).emit('logout', 'another device');
			socket_user.delete(socket_id);
		}
		user_socket.set(username, socket.id);
		socket_user.set(socket.id, username);
		socket.emit('login');
	});

	socket.on('logout', () => {
		let username = socket_user.get(socket.id);
		socket_user.delete(socket.id);
		user_socket.delete(username);
		socket.emit('logout', 'regular');
	});

	socket.on('v2/message', (friend, message) => {
		let { text } = message;
		message.time = new Date().getTime();
		console.log(message);
		let friend_socket = user_socket.get(friend);
		if (friend_socket) {
			socket.to(friend_socket).emit('v2/message', socket_user.get(socket.id), message);
		}
	});

	socket.on('v2/friend/add', friend => {
		let friend_socket = user_socket.get(friend);
		if (friend_socket) {
			socket.to(user_socket.get(friend)).emit('v2/friend/add', socket_user.get(socket.id));			
		}
	});

	socket.on('v2/friend/remove', friend => {
		let friend_socket = user_socket.get(friend);
		if (friend_socket) {
			socket.to(user_socket.get(friend)).emit('v2/friend/remove', socket_user.get(socket.id));			
		}
	});

	socket.on('v2/friend/access', friend => {
		let friend_socket = user_socket.get(friend);
		if (friend_socket) {
			socket.to(user_socket.get(friend)).emit('v2/friend/access', socket_user.get(socket.id));			
		}
	});

	socket.on('v1/message read', (friend, chat_id) => {
		let friend_socket = user_socket.get(friend);
		if (friend_socket) {
			socket.to(user_socket.get(friend)).emit('v1/message read', socket_user.get(socket.id), chat_id);			
		}
	});

	socket.on('disconnect', reason => {
		console.log(reason);
		let username = socket_user.get(socket.id);
		if (username) {
			user_socket.delete(username);
		}
		socket_user.delete(socket.id);
	});
});

module.exports = io;