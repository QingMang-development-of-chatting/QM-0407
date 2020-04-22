const chat = require('socket.io-client')('http://127.0.0.1:3000/chat');
const readline = require('readline');

chat.on('v1/message', msg => console.log(`${msg.sender}: ${msg.text}`));

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const readLine = () => {
		return new Promise(
			resolve => rl.on('line', str => resolve(str))
			);
};

const main = async function() {
	console.log('please enter your nickname...');
	const nickname = await readLine();
	console.log(`Welcome! ${nickname}, type something nice!`);
	while (true) {
		const text = await readLine();
		console.log(`You: ${text}`);
		chat.emit('v1/message', { sender: nickname, text: text });
	}
};

main();
