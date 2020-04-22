/**
 * Module dependencies
 */
const Koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-body');
const Server = require('http');
const router = require('./router/router');
const io = require('./socket/socket');

/**
 * Application
 */
const app = new Koa();

const server = require('http').createServer(app.callback());

io.attach(server);

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
app
	.use(router.routes())
	.use(router.allowedMethods());

if (!module.parent) {
	server.listen(PORT, () => {
		console.log(`QingMang Server listening on port ${PORT}.`);
	});
}

module.exports = app;