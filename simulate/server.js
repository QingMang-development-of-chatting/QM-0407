/**
 * Module dependencies
 */
const io_server = require('./socket/socket');
const http_server = require('./http/http');
const { PORT } = require('./constant');

// attaches the io-server to http-server
io_server.attach(http_server);

// listens on port
http_server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
