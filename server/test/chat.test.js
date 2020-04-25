const chat = require('socket.io-client')('http://127.0.0.1:3000/chat');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const readLine = () => {
	return new Promise(
		resolve => rl.on('line', str => resolve(str))
		);
};

chat.on('v1.1/message', (room_id, msg) => console.log(`${room_id}, ${msg.sender}: ${msg.text}`));

const main = async function() {
	console.log('please enter your nickname...');
	const nickname = await readLine();
	console.log(`Welcome! ${nickname}`);
	while (true) {
		console.log('join a room!');
		const room_id = await readLine();
		chat.emit('v1/join room', room_id);
		console.log('type something nice! character "&" to leave the current room');
		while ((text = await readLine()) !== '&') {
			console.log(`You: ${text}`);
			chat.emit('v1.1/message', room_id, { sender: nickname, text: text });
		}
		chat.emit('v1/leave room', room_id);
	}
};

main();
