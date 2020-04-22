const Server = require('socket.io');

const io = new Server();

const chat = io.of('/chat');

chat.on('connection', socket => {
	console.log(`${socket.id} connected`);
	socket.join('public', () => {
		socket.on('v1/message', msg => {
			socket.to('public').broadcast.emit('v1/message', msg);
		});
	});

});

module.exports = io;