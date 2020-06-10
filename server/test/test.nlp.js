/**
 * Module denpendencies
 */
const expect = require('expect.js');
const fs = require('fs');
const path = require('path');
const NLP = require('../nlp/nlp');

// create a nlp service
const nlp = new NLP();

describe('NLP', function() {
	describe('#textfilter()', function() {
		it('should filter the sensitive words', async function() {
			this.timeout(50000);
			const result = await nlp.textfilter('色情');
			expect(result).to.eql('*情');
		});
	});

	describe('#sentiment()', function() {
		it('should return a possibility', async function() {
			this.timeout(50000);
			const result_pos = await nlp.sentiment('哈哈');
			expect(result_pos).to.be.a('number');

			const result_neg = await nlp.sentiment('尼玛');
			expect(result_neg).to.be.a('number');
		});
	});

	describe('#cloud()', function() {
		it('should create an image', async function() {
			this.timeout(50000);
			const result = await nlp.cloud();
			await new Promise(resolve => fs.access(path.join(__dirname, '../nlp/cloud.png'), fs.constants.F_OK, err => {
				if (err) {
					throw err;
				}
				else {
					resolve();
				}
			}));
		});
	});
});
