/**
 * Module dependencies
 */
const Koa = require('koa');
const session = require('koa-session')
const bodyParser = require('koa-body');
const router = require('./router/router')

/**
 * Application
 */
const app = new Koa();

/**
 * PORT (default: 3000)
 */
const PORT = process.env.PORT || 3000;

app.keys = ['QingMang', 'Server'];

// session
app.use(session(app));

// request body parser
app.use(bodyParser());

// router
app.use(router);

if (!module.parent) {
	app.listen(PORT, () => {
		console.log(`QingMang Server listening on port ${PORT}.`);
	});
}

module.exports = app;