/**
 * Module dependencies
 */
const compose = require('koa-compose');
const Router = require('@koa/router');
const controller = require('../controller/controller');

const router = new Router();

/**
 * register router middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
router.post('/register', async ctx => {
	await controller.register(ctx);
});

/**
 * login router middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
router.post('/login', async ctx => {
	await controller.login(ctx);
})

/**
 * logout router middleware
 * 
 * static method
 * 
 * @param {Koa.ctx} ctx
 */
router.get('/logout', async ctx => {
	await controller.logout(ctx);
});

module.exports = router;