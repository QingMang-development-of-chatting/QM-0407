/**
 * Module denpendencies
 */
const expect = require('expect.js');
const fs = require('fs');
const NLPSservice = require('../service/service.nlp');

// create a nlp service
const nlp_service = new NLPSservice();

describe('NLPSservice', function() {
	describe('#textfilter()', function() {
		this.timeout(50000);
		it('should filter the sensitive words', async function() {
			const result = await nlp_service.textfilter('色情');
			expect(result).to.eql('*情');
		});
	});

	describe('#sentiment()', function() {
		this.timeout(50000);
		it('should return a possibility', async function() {
			const result_pos = await nlp_service.sentiment('哈哈');
			expect(result_pos).to.be.a('number');

			const result_neg = await nlp_service.sentiment('尼玛');
			expect(result_neg).to.be.a('number');
		});
	});

	describe('#cloud()', function() {
		it('should create an image', async function() {
			this.timeout(50000);
			const result = await nlp_service.cloud();
			await fs.access('../nlp/cloud.png', fs.constants.F_OK, err => {});
		});
	});
});
