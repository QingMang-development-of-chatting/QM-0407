/**
 * Module Dependencies
 */
const service = require('../service/friendService');

/**
 * API
 */
const Controller = {};

/**
 * Get user's friends
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.getFriends = async function(ctx) {
	let { username } = ctx.params;
	const friends = await service.getFriendArray(username);
	ctx.status = 200;
	ctx.body = friends;
};

/**
 * Get user's notifications
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.getNotifications = async function(ctx) {
	let { username } = ctx.params;
	const notifications = await service.getFriendRequest(username);
	ctx.status = 200;
	ctx.body = notifications;
};

module.exports = Controller;