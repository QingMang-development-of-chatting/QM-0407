/**
 * Module dependencies
 */
const Router = require('@koa/router');
const { HTTP, SERVICE: { STATUS: STATUS } } = require('../constant');
const { friend_service } = require('../service/service.singleton');

// builds a router
const router = new Router();

// sets routes, get user's friends
router.get(HTTP.V1.FRIEND.GET_FRIENDS, async ctx => {
	const { username } = ctx.params;

	const is_valid = username !== ':username';
	if (!is_valid) {
		ctx.status = 400;
		return;
	}
	
	const result = await friend_service.getFriends(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
	}
});

// sets routes, reject an applicant of the user
router.put(HTTP.V1.FRIEND.REJECT_APPLICANT, async ctx => {
	const { username, applicant } = ctx.params;

	const is_valid_username = username !== ':username';
	const is_valid_applicant = applicant !== ':applicant';
	const is_valid = is_valid_username && is_valid_applicant;
	if (!is_valid) {
		ctx.status = 400;
		return;
	}

	const result = await friend_service.rejectUserToBeFriend(username, applicant);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
	}
	else if (result.status === STATUS.REJECT) {
		ctx.status = 409;
		ctx.body = result.reason;
	}
});

// sets routes, get user's applicants
router.get(HTTP.V1.FRIEND.GET_APPLICANTS, async ctx => {
	const { username } = ctx.params;

	let is_valid = username !== ':username';

	if (!is_valid) {
		ctx.status = 400;
		return;
	}
	const result = await friend_service.getNotification(username);
	if (result.status === STATUS.OK) {
		ctx.status = 200;
		ctx.body = result.data;
	}
});

/**
 * Expose `router`
 */
module.exports = router;
