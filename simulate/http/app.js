/**
 * Module dependencies
 */
const koa = require('koa');
const body_parser = require('koa-body');
const user_router = require('./userrouter');
const user_info_router = require('./userinforouter');
const friend_router = require('./friendrouter');
const chat_router = require('./chatrouter');

/**
 * Application
 */
const app = new koa();

// uses body parser
app.use(body_parser());

// sets user router
app.use(user_router.routes());
app.use(user_router.allowedMethods());

// sets user info router
app.use(user_info_router.routes());
app.use(user_info_router.allowedMethods());

// sets friend router
app.use(friend_router.routes());
app.use(friend_router.allowedMethods());

// sets friend router
app.use(chat_router.routes());
app.use(chat_router.allowedMethods());

/**
 * Expose `app`
 */
module.exports = app;
