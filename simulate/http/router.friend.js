/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { friend_service } = require('../simulate/service.singleton');

// builds a router
const router = new Router();

// sets routes, get user's friends
router.get(HTTP.V1.FRIEND.GET_FRIENDS, async ctx => {
	const { username } = ctx.params;
	
	const result = await friend_service.getFriends(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
	}
	else if (result.status === STATUS.BAD_PARAM) {
		ctx.status = 400;
		ctx.body = result.reason;
	}
});

// sets routes, reject an applicant of the user
router.put(HTTP.V1.FRIEND.REJECT_APPLICANT, async ctx => {
	const { username, applicant } = ctx.params;
	console.table([username, applicant])

	const result = await friend_service.rejectUserToBeFriend(username, applicant);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
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

// sets routes, get user's applicants
router.get(HTTP.V1.FRIEND.GET_APPLICANTS, async ctx => {
	const { username } = ctx.params;
	
	const result = await friend_service.getNotification(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
	}
	else if (result.status === STATUS.BAD_PARAM) {
		ctx.status = 400;
		ctx.body = result.reason;
	}
});

/**
 * Expose `router`
 */
module.exports = router;
