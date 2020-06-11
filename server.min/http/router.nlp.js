/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { nlp_service } = require('../service/service.singleton');

// builds a router
const router = new Router();

// set routes, register the user
router.get(HTTP.V1.NLP.CLOUD, async ctx => {
	const { username } = ctx.params;

	const is_valid = username !== ':username';
	if (!is_valid) {
		ctx.status = 400;
		return;
	}

	const result = await nlp_service.cloud(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.set('content-type', 'image/png');
		ctx.body = result.data;
	}
	else if (result.status === STATUS.REJECT) {
		ctx.status = 409;
		ctx.body = result.reason;
	}
});

/**
 * Expose `router`
 */
module.exports = router;
