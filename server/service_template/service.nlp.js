/**
 * Module dependencies
 */
const fs = require('fs');
const path = require('path');
// TODO: require `query`
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
	// TODO: query the database, 获取该用户最近的200条发言
	
	// TODO: case: 如果发言很少
	if (messages.length <= 10) {
		return { status: STATUS.REJECT, reason: REASON.CLOUD.FEW };
	}

	// 这里将发言写入文件history.txt
	let str = '';
	for (let message of messages) {
		str = str + message.text;
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
