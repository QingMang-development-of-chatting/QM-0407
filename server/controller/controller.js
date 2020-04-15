/**
 * Module Dependencies
 */
const service = require('../service/service')

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
	if (!service.register(username, password, nickname))
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
	console.log(ctx.session.authenticated);
	if (ctx.session.authenticated) return ctx.status = 403;
	let { username, password, nickname } = ctx.request.body;
	if (!service.login(username, password))
		return ctx.status = 400;
	ctx.status = 200;
	ctx.session.authenticated = true;
};

/**
 * logout controller middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
Controller.logout = async function(ctx) {
	ctx.session.authenticated = false;
	return ctx.status = 200;
};

module.exports = Controller;