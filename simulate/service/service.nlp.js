/**
 * Module dependencies
 */
const { spawn } = require('child_process');

/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

/**
 * Replace the sensitive words in text by `*`.
 *
 * Examples:
 *
 *   service.textfilter('色情');  // => '*情'
 *
 * @param {String} text
 * @return {String} for result
 * @api public
 */
Service.prototype.textfilter = async function(text) {
	const textfilter = spawn('python', ['../nlp/textfilter.py', text]);

	const result = await new Promise(resolve => {
		textfilter.stdout.on('data', data => {
			data = `${data}`.trim();
			resolve(data);
		});

		textfilter.stderr.on('data', data => {
			console.log(`stderr: ${data}`);
		});

		textfilter.on('close', code => {
			if (code !== 0) {
				console.log(`process textfilter.py exit, code ${code}`);
			}
			textfilter.stdin.end();
		});
	});

	return result;
};

/**
 * Get the posssibility of the positive aspect of text.
 * 
 * positive when the greater than 0.5,
 * negtive when less than 0.5.
 *
 * Examples:
 *
 *   service.sentiment('哈哈');
 *
 * @param {String} text
 * @return {Number} for result
 * @api public
 */
Service.prototype.sentiment = async function(text) {
	const sentiment = spawn('python', ['../nlp/sentiment.py', text]);

	const result = await new Promise(resolve => {
		sentiment.stdout.on('data', data => {
			data = `${data}`.trim();
			data = Number.parseFloat(data);
			resolve(data);
		});

		sentiment.stderr.on('data', data => {
			console.log(`stderr: ${data}`);
		});

		sentiment.on('close', code => {
			if (code !== 0) {
				console.log(`process sentiment.py exit, code ${code}`);
			}
			sentiment.stdin.end();
		});
	});

	return result;
};

/**
 * Read the text from '/nlp/history` and draw a wordcloud on '/nlp/cloud.png'.
 * Examples:
 *
 *   service.cloud('哈哈');
 * 
 * @return {Number} for result
 * @api public
 */
Service.prototype.cloud = async function() {
	const cloud = spawn('python', ['../nlp/cloud.py']);

	const result = await new Promise(resolve => {
		cloud.stdout.on('data', data => {
			resolve();
		});

		cloud.stderr.on('data', data => {
			console.log(`stderr: ${data}`);
		});

		cloud.on('close', code => {
			if (code !== 0) {
				console.log(`process cloud.py exit, code ${code}`);
			}
			cloud.stdin.end();
		});
	});

	return result;
};

/**
 * Expose `Service`
 */
module.exports = Service;
