/**
 * Module dependencies
 */
const app = require('./app');
const http = require('http');

/**
 * HTTP server
 */
const server = http.createServer(app.callback());

/**
 * Expose `server`
 */
module.exports = server;
