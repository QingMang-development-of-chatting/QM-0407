/**
 * Module dependencies
 */
const fs = require('fs');
const path = require('path');
const query = require('../query3.0/chatFunc');
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
	const messages = await query.unreadRoom({user_id: username, n: 200});

	if (messages.length < 20) {
		return { status: STATUS.REJECT, reason: REASON.CLOUD.FEW }
	}

	let str = '';
	for (let message of messages) {
		str = str + message.chat;
	}

	const history_filename = path.join(__dirname, '../nlp/history.txt');

	await new Promise(resolve => {
		fs.writeFile(history_filename, str, err => {
			if (err) {
				throw err;
			}
			resolve();
		});
	});

	await nlp.cloud();

	const cloud_filename = path.join(__dirname, '../nlp/cloud.png');

	const result = await new Promise(resolve => fs.readFile(cloud_filename, 'base64', (err, data) => {
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
