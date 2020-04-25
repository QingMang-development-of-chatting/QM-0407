const Server = require('socket.io');
const service = require('../service/msgService');

const io = new Server();

const chat = io.of('/chat');

// chat.on('connection', socket => {
// 	console.log(`${socket.id} connected`);
// 	socket.join('public', () => {
// 		socket.on('v1/message', msg => {
// 			socket.to('public').broadcast.emit('v1/message', msg);
// 			service.insertChat(msg);
// 		});
// 	});
// });

chat.on('connection', socket => {
	console.log(`${socket.id} connected`);
	socket.on('v1/join room', room_id => {
		socket.join(room_id);
	});
	socket.on('v1/leave room', room_id => {
		socket.leave(room_id);
	});
	socket.on('v1.1/message', (room_id, msg) => {
		socket.to(room_id).broadcast.emit('v1.1/message', room_id, msg);
		service.insertChat(room_id, msg);
	});
});

module.exports = io;