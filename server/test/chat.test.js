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

// chat.on('v1.1/message', (room_id, msg) => console.log(`${room_id}, ${msg.sender}: ${msg.text}`));

const mailbox = [];
const friends = [];

chat.on('login', () => {
	console.log(`Welcome!`);
});

chat.on('logout', (reason) => {
	console.log(`u r out, ${reason}`);
});

chat.on('message', (friend, text) => {
	console.log(`${friend}: ${text}`);
});

chat.on('v1/friend/add', friend => {
	console.log('new annotation from ' + friend);
	mailbox.push({type: 'add', name: friend});
});

chat.on('v1/friend/access', friend => {
	console.log('new friend! say hello to ' + friend);
	friends.push(friend);
});

const main = async function() {
	while (true) {
		console.log('please enter your command...');
		const command = await readLine();
		if (command === 'login') {
			console.log('please enter your nickname...');
			const nickname = await readLine();
			chat.emit('login', nickname);
		}
		if (command === 'logout') {
			chat.emit('logout');
		}
		if (command === 'chat') {
			console.log('please enter your friend name...');
			const friend = await readLine();
			console.log('say something...');
			const text = await readLine();
			chat.emit('message', friend, text);
		}
		if (command === 'friends') {
			console.table(friends);
		}
		if (command === 'mails') {
			console.table(mailbox);
		}
		if (command === 'add friend') {
			console.log('please enter name to be friend...');
			const friend = await readLine();
			chat.emit('v1/friend/add', friend);
		}
		if (command === 'new friend') {
			console.log('please enter name to access...');
			const friend = await readLine();
			chat.emit('v1/friend/access', friend);
			friends.push(friend);
		}
	}
	// console.log(`Welcome! ${nickname}`);
	// while (true) {
	// 	console.log('join a room!');
	// 	const room_id = await readLine();
	// 	chat.emit('v1/join room', room_id);
	// 	console.log('type something nice! character "&" to leave the current room');
	// 	while ((text = await readLine()) !== '&') {
	// 		console.log(`You: ${text}`);
	// 		chat.emit('v1.1/message', room_id, { sender: nickname, text: text });
	// 	}
	// 	chat.emit('v1/leave room', room_id);
	// }
};

main();
