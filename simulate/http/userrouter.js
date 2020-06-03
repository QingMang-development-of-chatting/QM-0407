/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { user_service } = require('../simulate/servicesingleton');

// builds a router
const router = new Router();

// set routes, register the user
router.post(HTTP.V1.USER.REGISTER, async ctx => {
	const { username, password, nickname } = ctx.request.body;
	const result = await user_service.register(username, password, nickname);
	if (result.status === STATUS.OK) {
		ctx.status = 201;
	}
	else if (result.status === STATUS.BAD_PARAM) {
		ctx.status = 400;
		ctx.body = result.reason;
	}
	else if (result.status === STATUS.REJECT) {
		ctx.status = 408;
		ctx.body = result.reason;
	}
});

/**
 * Expose `router`
 */
module.exports = router;
