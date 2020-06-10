/**
 * Module dependencies
 */
const { spawn } = require('child_process');
const path = require('path');

/**
 * `NLP` constructor
 *
 * @api public
 */
function NLP() {}

/**
 * Replace the sensitive words in text by `*`.
 *
 * Examples:
 *
 *   nlp.textfilter('色情');  // => '*情'
 *
 * @param {String} text
 * @return {String} for result
 * @api public
 */
NLP.prototype.textfilter = async function(text) {
	const textfilter = spawn('python', [path.join(__dirname, 'textfilter.py'), text]);

	const result = await new Promise(resolve => {
		textfilter.stdout.on('data', data => {
			data = `${data}`.trim();
			resolve(data);
		});

		textfilter.stderr.on('data', data => {
			throw new Error('Util textfilter');
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
 *   nlp.sentiment('哈哈');
 *
 * @param {String} text
 * @return {Number} for result
 * @api public
 */
NLP.prototype.sentiment = async function(text) {
	const sentiment = spawn('python', [path.join(__dirname, 'sentiment.py'), text]);

	const result = await new Promise(resolve => {
		sentiment.stdout.on('data', data => {
			data = `${data}`.trim();
			data = Number.parseFloat(data);
			resolve(data);
		});

		sentiment.stderr.on('data', data => {
			console.log(`stderr ${data}`);
			throw new Error('Util sentiment');
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
 *
 * Examples:
 *
 *   nlp.cloud('哈哈');
 * 
 * @return {Number} for result
 * @api public
 */
NLP.prototype.cloud = async function() {
	const cloud = spawn('python', [path.join(__dirname, 'cloud.py')]);

	const result = await new Promise(resolve => {
		cloud.stdout.on('data', data => {
			resolve();
		});

		cloud.stderr.on('data', data => {
			if (`${data}` !== 'Paddle enabled successfully......\r\n')
				throw new Error('Util cloud');
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
 * Expose `NLP`
 */
module.exports = NLP;
