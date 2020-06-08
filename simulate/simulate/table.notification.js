/**
 * Module dependencies
 */
const { randDelay } = require('../util');
const { SIMULATE } = require('../constant');

const delay = () => randDelay(SIMULATE.MAX_DELAY);


/**
 * `Table` constructor
 *
 * @api public
 */
function Table() {
	this._notifications = new Map();
}

/**
 * Create notification or update the old one and sort it.
 *
 * Examples:
 *
 *   table.createNotification({
 *	   sender: '...', receiver: '...', type: 0
 *   });
 *
 * @param {Object} notification
 * @param {String} notification.sender
 * @param {String} notification.receiver
 * @param {Number} notification.type
 * @return {Boolean} for result
 * @api public
 */
Table.prototype.createNotification = async function(notification) {
	await delay();
	const { sender, receiver, type } = notification;

	if (!this._notifications.has(receiver)) {
		this._notifications.set(receiver, []);
	}
	const _notification = this._notifications.get(receiver);
	let i = 0;
	for (let { sender: _sender, type: _type } of _notification) {
		if (_sender === sender) {
			if (_type === type) {
				return false;
			}
			_notification.splice(i, 1);
			break;
		}
		i++;
	}
	_notification.unshift({ sender, type });
	return true;
};

/**
 * Get notifications of `receiver`.
 *
 * Examples:
 *
 *   table.readNotificationsByReceiver('...');
 *
 * @param {String} receiver
 * @return {Array|NULL} for result
 * @api public
 */
Table.prototype.readNotificationsByReceiver = async function(receiver) {
	await delay();
	if (!this._notifications.has(receiver)) {
		return null;
	}
	return this._notifications.get(receiver);
};

/**
 * Update the type of notifications idnetified by `sender` and `receiver`.
 *
 * Examples:
 *
 *   table.updateTypeBySenderAndReceiver('...', '...', 0);
 *
 * @param {String} sender
 * @param {String} receiver
 * @param {Number} old_type
 * @param {Number} new_type
 * @return {Boolean} succeed or fail
 * @api public
 */
Table.prototype.updateTypeBySenderAndReceiverAndType = async function(sender, receiver, old_type, new_type) {
	await delay();
	if (!this._notifications.has(receiver)) {
		return false;
	}
	const notification = this._notifications.get(receiver);
	let is_modified = false;
	_notification = notification.map(e => {
		if (e.sender === sender && e.type === old_type) {
			e.type = new_type;
			is_modified = true;
		}
		return e;
	});
	if (!is_modified) {
		return false;
	}
	this._notifications.set(receiver, _notification);
	return true;
};

/**
 * Expose `Table`
 */
module.exports = Table;
