/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { user_service } = require('../simulate/service.singleton');

// builds a router
const router = new Router();

// sets routes, get user's basic infomation
router.get(HTTP.V1.USERINFO.GET_INFO, async ctx => {
	const { username } = ctx.params;

	const is_valid = username !== ':username';

	if (!is_valid) {
		ctx.status = 400;
		return;
	}

	const result = await user_service.getInfo(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
	}
	else if (result.status === STATUS.NOT_FOUND) {
		ctx.status = 404;
	}
});

// sets routes, set user's password
router.put(HTTP.V1.USERINFO.SET_PASSWORD, async ctx => {
	const { username } = ctx.params;
	const { password } = ctx.request.body;

	const is_valid_username = username !== ':username';
	const is_valid_password = typeof(password) === 'string';
	const is_valid = is_valid_username && is_valid_password;

	if (!is_valid) {
		ctx.status = 400;
		return;
	}

	const result = await user_service.setPassword(username, password);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
	}
	else if (result.status === STATUS.NOT_FOUND) {
		ctx.status = 404;
	}
});

// sets routes, set user's nickname
router.put(HTTP.V1.USERINFO.SET_NICKNAME, async ctx => {
	const { username } = ctx.params;
	const { nickname } = ctx.request.body;

	const is_valid_username = username !== ':username';
	const is_valid_nickname = typeof(nickname) === 'string';
	const is_valid = is_valid_username && is_valid_nickname;

	if (!is_valid) {
		ctx.status = 400;
		return;
	}

	const result = await user_service.setNickname(username, nickname);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
	}
	else if (result.status === STATUS.NOT_FOUND) {
		ctx.status = 404;
	}
});

// sets routes, set user's photo
router.put(HTTP.V1.USERINFO.SET_PHOTO, async ctx => {
	const { username } = ctx.params;
	const { photo } = ctx.request.body;

	const is_valid_username = username !== ':username';
	const is_valid_photo = typeof(photo) === 'string';
	const is_valid = is_valid_username && is_valid_photo;

	if (!is_valid) {
		ctx.status = 400;
		return;
	}

	const result = await user_service.setPhoto(username, photo);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
	}
	else if (result.status === STATUS.NOT_FOUND) {
		ctx.status = 404;
	}
});

/**
 * Expose `router`
 */
module.exports = router;
