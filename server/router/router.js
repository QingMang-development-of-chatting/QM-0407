/**
 * Module dependencies
 */
const compose = require('koa-compose');
const Router = require('@koa/router');
const controller = require('../controller/controller');

const router = new Router();

/**
 * register router middleware
 */
router.post('/register', controller.register);

/**
 * login router middleware
 */
router.post('/login', controller.login);

/**
 * logout router middleware
 */
router.get('/logout', controller.logout);

module.exports = router;