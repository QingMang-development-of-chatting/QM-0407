/**
 * Mudule dependencies
 */
const UserSocketBiMap = require('./usersocketbimap');

// builds a user event handler
const user_socket_bimap = new UserSocketBiMap();

/**
 * Expose `user_socket_bimap`
 */
module.exports = user_socket_bimap;
