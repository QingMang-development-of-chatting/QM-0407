/**
 * Module denpendencies
 */
const expect = require('expect.js');
const fs = require('fs');
const NLP = require('../nlp/nlp');

// create a nlp service
const nlp = new NLP();

describe('NLP', function() {
	describe('#textfilter()', function() {
		this.timeout(50000);
		it('should filter the sensitive words', async function() {
			const result = await nlp.textfilter('色情');
			expect(result).to.eql('*情');
		});
	});

	describe('#sentiment()', function() {
		this.timeout(50000);
		it('should return a possibility', async function() {
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
			await fs.access('../nlp/cloud.png', fs.constants.F_OK, err => {});
		});
	});
});
