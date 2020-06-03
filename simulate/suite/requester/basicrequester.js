/**
 * `BasicRequester` constructor
 *
 * @api public
 */
function BasicRequester() {
	this._axios;
}

/**
 * Bind axios to the requester.
 *
 * Examples:
 * 
 *   basic_requester.bindAxios(axios);
 *
 * @api public
 */
BasicRequester.prototype.bindAxios = function(axios) {
	this._axios = axios;
};

/**
 * Expose `BasicRequester`
 */
module.exports = BasicRequester;
