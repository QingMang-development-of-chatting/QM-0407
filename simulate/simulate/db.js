/**
 * Module dependencies
 */
const UserTable = require('./usertable');
const FriendTable = require('./table.friend');
const NotificationTable = require('./table.notification');
const PrivateRoomTable = require('./table.privateroom');
const PrivateMessageTable = require('./table.privatemessage');

/**
 * `Database` constructor
 *
 * @api public
 */
function Database() {
	this.users = new UserTable();
	this.friends = new FriendTable();
	this.notifications = new NotificationTable();
	this.privaterooms = new PrivateRoomTable();
	this.privatemessages = new PrivateMessageTable();
}

if (!module.parent) {
	const db = new Database();
	let result;

	function expect(val) {
		console.log(`expect ${val}, result ${result}`);
	}

	// test user table
	async function test_user_table() {
		console.log('Test UserTable');
		result = await db.users.createUser('Juncheng Zeng', '0712', 'ZengJia');
		expect(true);
		result = await db.users.createUser('Juncheng Zeng', '1234', 'ZengJia2020');
		expect(false);
		result = await db.users.readUserByUsername('Juncheng Zeng');
		console.log(result);
		expect('Object');
		result = await db.users.readUserByUsername('Yunic');
		expect('null');
		result = await db.users.readPasswordByUsername('Juncheng Zeng');
		expect('string');
		result = await db.users.updatePasswordByUsername('Yunic', '0000');
		expect(false);
		result = await db.users.updatePasswordByUsername('Juncheng Zeng', 'ZengJia@nodejs');
		expect(true);
		result = await db.users.readUserByUsername('Juncheng Zeng');
		console.log(result);
		expect('Object');
		result = await db.users.updateNicknameByUsername('Yunic', 'YWY');
		expect(false);
		result = await db.users.updateNicknameByUsername('Juncheng Zeng', 'ZengJia2020');
		expect(true);
		result = await db.users.readUserByUsername('Juncheng Zeng');
		console.log(result);
		expect('Object');
		result = await db.users.updatePhotoByUsername('Yunic', '!@#$%^&*');
		expect(false);
		result = await db.users.updatePhotoByUsername('Juncheng Zeng', '!@#$%^&*');
		expect(true);
		result = await db.users.readUserByUsername('Juncheng Zeng');
		console.log(result);
		expect('Object');
	}

	// test friend table
	async function test_friend_table() {
		console.log('Test FriendTable');
		result = await db.friends.createFriends('Juncheng Zeng', 'Yunic');
		expect(true);
		result = await db.friends.createFriends('Yunic', 'Juncheng Zeng');
		expect(false);
		await db.friends.createFriends('Juncheng Zeng', 'H3CO3');
		await db.friends.createFriends('Juncheng Zeng', 'ZZ');
		result = await db.friends.readFriendsByUsername('Juncheng Zeng');
		console.log(result);
		expect('object');
		result = await db.friends.readFriendsByUsername('Yunic');
		console.log(result);
		expect('object');
		result = await db.friends.readFriendsByUsername('No one');
		expect('null');
		result = await db.friends.deleteFriendsByUsernames('Yunic', 'Juncheng Zeng');
		expect(true);
		result = await db.friends.readFriendsByUsername('Juncheng Zeng');
		console.log(result);
		expect('object');
		result = await db.friends.deleteFriendsByUsernames('Yunic', 'Juncheng Zeng');
		expect(false);
		result = await db.friends.deleteFriendsByUsernames('No one 1', 'No one 2');
		expect(false);
	}

	// test notification table
	async function test_notification_table() {
		console.log('Test NotificationTable');
		const { NOTIFICATION: { TYPE: TYPE }} = require('../constant');
		let notification = {
			sender: 'Juncheng Zeng',
			receiver: 'Yunic',
			type: TYPE.APPLY
		};
		result = await db.notifications.createNotification(notification);
		expect(true);
		result = await db.notifications.createNotification(notification);
		expect(false);
		notification = {
			sender: 'Juncheng Zeng',
			receiver: 'H3CO3',
			type: TYPE.APPLY
		};
		result = await db.notifications.createNotification(notification);
		expect(true);
		notification = {
			sender: 'Yunic',
			receiver: 'H3CO3',
			type: TYPE.APPLY
		};
		result = await db.notifications.readNotificationsByReceiver('Yunic');
		console.log(result);
		expect('object');
		result = await db.notifications.createNotification(notification);
		expect(true);
		result = await db.notifications.updateTypeBySenderAndReceiverAndType(
			'Juncheng Zeng', 'Yunic', TYPE.APPLY,  TYPE.ACCESS);
		expect(true);
		result = await db.notifications.updateTypeBySenderAndReceiverAndType(
			'Juncheng Zeng', 'Yunic', TYPE.DELETED,  TYPE.ACCESS);
		expect(false);
		result = await db.notifications.readNotificationsByReceiver('Yunic');
		console.log(result);
		expect('object');
		result = await db.notifications.readNotificationsByReceiver('Juncheng Zeng');
		expect('null');
		notification = {
			sender: 'Yunic',
			receiver: 'Juncheng Zeng',
			type: TYPE.ACCESSED
		};
		result = await db.notifications.createNotification(notification);
		expect(true);
		result = await db.notifications.readNotificationsByReceiver('Juncheng Zeng');
		console.log(result);
		expect('object');
	}

	// test private room table
	async function test_private_room_table() {
		console.log('Test PrivateRoomTable');
		result = await db.privaterooms.createPrivateRoom('Juncheng Zeng', 'Yunic');
		expect(true);
		result = await db.privaterooms.createPrivateRoom('Yunic', 'Juncheng Zeng');
		expect(false);
		await db.privaterooms.createPrivateRoom('Juncheng Zeng', 'H3CO3');
		await db.privaterooms.createPrivateRoom('Juncheng Zeng', 'ZZ');
		result = await db.privaterooms.readPrivateRoomsByUsername('Juncheng Zeng');
		console.log(result);
		expect('object');
		result = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2('Juncheng Zeng', 'Yunic');
		console.log(result);
		expect('object');
		result = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2('Juncheng Zeng', 'No one');
		expect('null');
		result = await db.privaterooms.readPrivateRoomsByUsername1AndUsername2('No one1', 'No one2');
		expect('null');
		result = await db.privaterooms.readPrivateRoomsByUsername('Yunic');
		console.log(result);
		expect('object');
		result = await db.privaterooms.readPrivateRoomsByUsername('No one');
		expect('null');
	}

	// test private message table
	async function test_private_message_table() {
		console.log('Test PrivateMessageTable');
		let message;
		message = {
			room: 'default',
			sender: 'Juncheng Zeng',
			text: 'Hello world!',
			time: new Date().getTime()
		};
		result = await db.privatemessages.createPrivateMessage(message);
		expect(true);
		message = {
			room: 'default',
			sender: 'Yunic',
			text: 'Hello Node.js!',
			time: new Date().getTime()
		};
		result = await db.privatemessages.createPrivateMessage(message);
		expect(true);
		result = await db.privatemessages.readPrivateMessagesByRoomAndTime('default', new Date().getTime());
		console.table(result);
		expect('object');
		message.sender = 'Juncheng Zeng'; message.text = 'Lets count!'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = 'OK.'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '1'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '2'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '3'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '4'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '5'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '6'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '7'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '8'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '9'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '10'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '11'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '12'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '13'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '14'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '15'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '16'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '17'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '18'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Juncheng Zeng'; message.text = '19'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		result = await db.privatemessages.readLastSendertByRoom('default');
		expect('string');
		message.sender = 'Yunic'; message.text = '20'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		result = await db.privatemessages.readUnreadCountByRoom('default');
		expect('number');
		result = await db.privatemessages.readLastSendertByRoom('default');
		expect('string');
		await db.privatemessages.updateIsReadBySenderAndRoom('Yunic', 'default');
		message.sender = 'Juncheng Zeng'; message.text = '21'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		result = await db.privatemessages.readUnreadCountByRoom('default');
		expect('number');
		message.sender = 'Yunic'; message.text = '22'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = '...'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		message.sender = 'Yunic'; message.text = 'where r u'; message.time = new Date().getTime();
		await db.privatemessages.createPrivateMessage(message);
		result = await db.privatemessages.readPrivateMessagesByRoomAndTime('default', new Date().getTime());
		console.table(result);
		expect('object');
	}

	test_private_room_table();
}

/**
 * Expose `Database`
 */
module.exports = Database;
