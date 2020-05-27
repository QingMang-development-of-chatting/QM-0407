/**
 * Module Dependencies
 */
const service = require('../service/userInfoService');

/**
 * API
 */
const Controller = {};

/**
 * Get users infos
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.getUsers = async function(ctx) {
	let { users } = ctx.request.body;
	const users_info = await service.getInfoByArray(users);
	ctx.status = 200;
	ctx.body = users_info;
};

/**
 * Update the nickname of a user
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.updateNickname = async function(ctx) {
	let { username, nickname } = ctx.request.body;
	const flag = await service.updateName(username, nickname);
	if (flag)
		ctx.status = 200;
	else
		ctx.status = 400;
};

/**
 * Update the photo of a user
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.updatePhoto = async function(ctx) {
	let { username, photo } = ctx.request.body;
	const flag = await service.updatePhoto(username, photo);
	if (flag)
		ctx.status = 200;
	else
		ctx.status = 400;
};

module.exports = Controller;