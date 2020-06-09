/**
 * Module dependencies
 */
const fs = require('fs');
const db = require('./db.singleton');
const { SERVICE: { STATUS: STATUS }, REASON } = require('../constant');
const nlp = require('../nlp/nlp.singleton');

/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

/**
 * Draw and encode a word cloud by collecting the text the `username` sends.
 *
 * Examples:
 *
 *   service.cloud('Steve_Jobs');
 * 
 * @param {String} username
 * @return {String} for result
 * @api public
 */
Service.prototype.cloud = async function(username) {
	const rooms_map = await db.privaterooms.readPrivateRoomsByUsername(username);
	if (rooms_map === null) {
		return { status: STATUS.REJECT, reason: REASON.CLOUD.FEW };
	}
	let messages = [];
	for (let room of [...rooms_map]) {
		const room_id = room[1];
		const messages_in_room = await db.privatemessages.readAllPrivateMessageByRoomAndSender(room_id, username);
		if (messages_in_room === null) {
			continue;
		}
		for (let message of messages_in_room) {
			const { text, time } = message;
			messages.push({ text, time });
		}
	}

	const messages_sort = messages.sort((message1, message2) => {
		return message2.time - message1.time;
	});
	
	if (messages_sort.length <= 10) {
		return { status: STATUS.REJECT, reason: REASON.CLOUD.FEW };
	}

	let str = '';
	for (let message of messages_sort) {
		str = str + message.text;
	}

	fs.writeFile('../nlp/history.txt', str, err => {
		if (err) {
			throw err;
		}
	});

	await nlp.cloud();

	const result = await new Promise(resolve => fs.readFile('../nlp/cloud.png', 'base64', (err, data) => {
		if (err) {
			throw err;
		}
		resolve(data);
	}));

	return { status: STATUS.OK, data: result };
};

/**
 * Expose `Service`
 */
module.exports = Service;
