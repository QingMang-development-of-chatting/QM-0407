/**
 * Module dependencies
 */
const compose = require('koa-compose');
const controller = require('../controller/controller');

/**
 * register router middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 * @param {middleware function} next
 */
async function register(ctx, next) {
	if (ctx.path !== '/register') return await next();
	if (ctx.method !== 'POST') return;
	await controller.register(ctx);
}

/**
 * login router middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 * @param {middleware function} next
 */
async function login(ctx, next) {
	if (ctx.path !== '/login') return await next();
	if (ctx.method !== 'POST') return;
	await controller.login(ctx);
}

/**
 * logout router middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 * @param {middleware function} next
 */
async function logout(ctx, next) {
	if (ctx.path !== '/logout') return await next();
	if (ctx.method !== 'GET') return;
	await controller.logout(ctx);
}

/**
 * API
 */
const router = compose([
	register,
	login,
	logout
	]);

module.exports = router;