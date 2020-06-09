/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { chat_service } = require('../simulate/service.singleton');

// builds a router
const router = new Router();

// sets routes, get user's recent chatlist
router.get(HTTP.V1.CHAT.GET_CHATLIST, async ctx => {
	const { username } = ctx.params;

	const is_valid = username !== ':username';
	if (!is_valid) {
		ctx.status = 400;
		return;
	}
	
	const result = await chat_service.getRecentChatList(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
	}
	else if (result.status === STATUS.NOT_FOUND) {
		ctx.status = 200;
		ctx.body = [];
	}
});

// sets routes, get user's recent chatlist
router.get(HTTP.V1.CHAT.GET_HISTORY, async ctx => {
	const { username, friend, time } = ctx.params;

	const is_valid_username = username !== ':username';
	const is_valid_friend = friend !== ':friend';
	const is_valid_time = /(^[0-9]*[1-9][0-9]*)/.test(time);
	const is_valid = is_valid_username && is_valid_friend && is_valid_time;

	if (!is_valid) {
		ctx.status = 400;
		return;
	}
	const modify_time = Number.parseInt(time);
	
	const result = await chat_service.getMessages(username, friend, modify_time);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
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
