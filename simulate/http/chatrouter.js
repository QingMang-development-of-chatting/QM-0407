/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { chat_service } = require('../simulate/servicesingleton');

// builds a router
const router = new Router();

// sets routes, get user's recent chatlist
router.get(HTTP.V1.CHAT.GET_CHATLIST, async ctx => {
	const { username } = ctx.params;
	
	const result = await chat_service.getRecentChatList(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
	}
	else if (result.status === STATUS.BAD_PARAM) {
		ctx.status = 400;
		ctx.body = result.reason;
	}
});

// sets routes, get user's recent chatlist
router.get(HTTP.V1.CHAT.GET_HISTORY, async ctx => {
	const { username, friend, time } = ctx.params;
	const modify_time = Number.parseInt(time);
	
	const result = await chat_service.getMessages(username, friend, modify_time);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
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
