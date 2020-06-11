/**
 * Module dependencies
 */
const io_server = require('./socket/socket');
const http_server = require('./http/http');
const { PORT } = require('./constant');

// attaches the io-server to http-server
io_server.attach(http_server);

// listens on port
if (!module.parent) {
	http_server.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});	
}

/**
 * Expose `http_server`
 */
module.exports = http_server;
