/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { user_service } = require('../simulate/service.singleton');

// builds a router
const router = new Router();

// set routes, register the user
router.post(HTTP.V1.USER.REGISTER, async ctx => {
	const { username, password, nickname } = ctx.request.body;

	const is_valid_username = typeof(username) === 'string';
	const is_valid_password = typeof(password) === 'string';
	const is_valid_nickname = typeof(nickname) === 'string';
	const is_valid = is_valid_username && is_valid_password && is_valid_nickname;
	if (!is_valid) {
		return { status: STATUS.BAD_PARAM };
	}

	const result = await user_service.register(username, password, nickname);
	if (result.status === STATUS.OK) {
		ctx.status = 201;
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
