/**
 * Module Dependencies
 */
const service = require('../service/userService');

/**
 * API
 */
const Controller = {};

/**
 * register controller middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.register = async function(ctx) {
	if (ctx.session.authenticated) return ctx.status = 403;
	let { username, password, nickname } = ctx.request.body;
	if (! await service.register(username, password, nickname))
		return ctx.status = 400;
	ctx.status = 200;
};

/**
 * login controller middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.login = async function(ctx) {
	if (ctx.session.authenticated) return ctx.status = 403;
	let { username, password, nickname } = ctx.request.body;
	if (! await service.login(username, password))
		return ctx.status = 400;
	ctx.status = 200;
	ctx.session.authenticated = true;
	ctx.session.username = username;
};

/**
 * logout controller middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.logout = async function(ctx) {
	const username = ctx.session.username;
	service.logout(username);
	ctx.session.authenticated = false;
	return ctx.status = 200;
};

module.exports = Controller;