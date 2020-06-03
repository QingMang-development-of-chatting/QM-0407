/**
 * Module dependencies
 */
const UserService = require('./service.user');
const FriendService = require('./service.friend');
const ChatService = require('./service.chat');
const { SERVICE: { STATUS: STATUS } } = require('../constant');

if (!module.parent) {
	const user_service = new UserService();
	const friend_service = new FriendService();
	const chat_service = new ChatService();
	let result;

	function expect(val) {
		console.log(`expect ${val}`);
		console.log(result);
	}

	// test user service
	async function test_user_service() {
		console.log('Test UserService');
		result = await user_service.register();
		expect(STATUS.BAD_PARAM);
		result = await user_service.register(1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.register('Juncheng Zeng');
		expect(STATUS.BAD_PARAM);
		result = await user_service.register('Juncheng Zeng', 1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.register('Juncheng Zeng', '0712');
		expect(STATUS.BAD_PARAM);
		result = await user_service.register('Juncheng Zeng', '0712', 1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.register('Juncheng Zeng', '0712', 'ZengJia');
		expect(STATUS.OK);
		result = await user_service.register('Juncheng Zeng', '0712', 'ZengJia');
		expect(STATUS.REJECT);
		result = await user_service.isValid();
		expect(STATUS.BAD_PARAM);
		result = await user_service.isValid(1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.isValid('Juncheng Zeng');
		expect(STATUS.BAD_PARAM);
		result = await user_service.isValid('Juncheng Zeng', 712);
		expect(STATUS.BAD_PARAM);
		result = await user_service.isValid('Juncheng Zeng', '0712');
		expect(STATUS.OK);
		result = await user_service.isValid('Juncheng Zeng', '0713');
		expect(STATUS.OK);
		result = await user_service.isValid('Yunic', '1234');
		expect(STATUS.OK);
		result = await user_service.getInfo();
		expect(STATUS.BAD_PARAM);
		result = await user_service.getInfo(1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.getInfo('Juncheng Zeng');
		expect(STATUS.OK);
		result = await user_service.getInfo('Yunic');
		expect(STATUS.NOT_FOUND);
		result = await user_service.setPassword();
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPassword(1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPassword('Juncheng Zeng');
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPassword('Juncheng Zeng', 1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPassword('Yunic', '1234');
		expect(STATUS.REJECT);
		result = await user_service.setPassword('Juncheng Zeng', '1234');
		expect(STATUS.OK);
		result = await user_service.isValid('Juncheng Zeng', '0712');
		expect(STATUS.OK);
		result = await user_service.isValid('Juncheng Zeng', '1234');
		expect(STATUS.OK);
		result = await user_service.getInfo('Juncheng Zeng');
		expect(STATUS.OK);
		result = await user_service.setNickname();
		expect(STATUS.BAD_PARAM);
		result = await user_service.setNickname(1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.setNickname('Juncheng Zeng');
		expect(STATUS.BAD_PARAM);
		result = await user_service.setNickname('Juncheng Zeng', 1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.setNickname('Yunic', '1234');
		expect(STATUS.REJECT);
		result = await user_service.setNickname('Juncheng Zeng', '1234');
		expect(STATUS.OK);
		result = await user_service.getInfo('Juncheng Zeng');
		expect(STATUS.OK);
		result = await user_service.setPhoto();
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPhoto(1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPhoto('Juncheng Zeng');
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPhoto('Juncheng Zeng', 1);
		expect(STATUS.BAD_PARAM);
		result = await user_service.setPhoto('Yunic', '1234');
		expect(STATUS.REJECT);
		result = await user_service.setPhoto('Juncheng Zeng', '1234');
		expect(STATUS.OK);
		result = await user_service.getInfo('Juncheng Zeng');
		expect(STATUS.OK);
	}

	// test friend service
	async function test_friend_service() {
		console.log('Test FriendService');
		result = await friend_service.getFriends();
		expect(STATUS.BAD_PARAM);
		result = await friend_service.getFriends('Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.getNotification();
		expect(STATUS.BAD_PARAM);
		result = await friend_service.getNotification('Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.applyUserToBeFriend();
		expect(STATUS.BAD_PARAM);
		result = await friend_service.applyUserToBeFriend(1);
		expect(STATUS.BAD_PARAM);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng');
		expect(STATUS.BAD_PARAM);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng', 1);
		expect(STATUS.BAD_PARAM);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng', 'Yunic');
		expect(STATUS.OK);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng', 'Yunic');
		expect(STATUS.REJECT);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng', 'H3CO3');
		expect(STATUS.OK);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng', 'ZZ');
		expect(STATUS.OK);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng', 'ZYF');
		expect(STATUS.OK);
		result = await friend_service.applyUserToBeFriend('H3CO3', 'Yunic');
		expect(STATUS.OK);
		result = await friend_service.applyUserToBeFriend('Juncheng Zeng', 'Yunic');
		expect(STATUS.REJECT);
		result = await friend_service.getNotification('Yunic');
		expect(STATUS.OK);
		result = await friend_service.getNotification('H3CO3');
		expect(STATUS.OK);
		result = await friend_service.accessUserToBeFriend('Yunic', 'Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.accessUserToBeFriend('Yunic', 'Juncheng Zeng');
		expect(STATUS.REJECT);
		result = await friend_service.accessUserToBeFriend('H3CO3', 'Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.accessUserToBeFriend('ZZ', 'Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.accessUserToBeFriend('ZZ', 'Yunic');
		expect(STATUS.REJECT);
		result = await friend_service.getFriends('Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.getFriends('Yunic');
		expect(STATUS.OK);
		result = await friend_service.getNotification('Yunic');
		expect(STATUS.OK);
		result = await friend_service.rejectUserToBeFriend('ZYF', 'Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.rejectUserToBeFriend('ZYF', 'Yunic');
		expect(STATUS.REJECT);
		result = await friend_service.getNotification('ZYF');
		expect(STATUS.OK);
		result = await friend_service.deleteFriend('Yunic', 'Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.deleteFriend('Yunic', 'ZZ');
		expect(STATUS.OK);
		result = await friend_service.getNotification('Juncheng Zeng');
		expect(STATUS.OK);
		result = await friend_service.getFriends('Juncheng Zeng');
		expect(STATUS.OK);
	}

	// test chat service
	async function test_chat_service() {
		console.log('Test ChatService');
		result = await chat_service.getRecentChatList();
		expect(STATUS.BAD_PARAM);
		result = await chat_service.getRecentChatList(1);
		expect(STATUS.BAD_PARAM);
		result = await chat_service.getRecentChatList('Juncheng Zeng');
		expect(STATUS.OK);
		result = await chat_service.getMessages('Juncheng Zeng', 'Yunic', new Date().getTime());
		expect(STATUS.REJECT);
		await friend_service.applyUserToBeFriend('Juncheng Zeng', 'Yunic');
		await friend_service.accessUserToBeFriend('Yunic', 'Juncheng Zeng');
		result = await chat_service.getMessages('Juncheng Zeng', 'Yunic', new Date().getTime());
		expect(STATUS.OK);
		let message;
		message = {
			sender: 'Juncheng Zeng',
			receiver: 'Juncheng Zeng',
			text: 'Hello World!',
			time: new Date().getTime()
		};
		result = await chat_service.addMessage(message);
		expect(STATUS.REJECT);
		message.receiver = 'Yunic';
		result = await chat_service.addMessage(message);
		expect(STATUS.OK);
		message.text = 'How r u?';
		result = await chat_service.addMessage(message);
		expect(STATUS.OK);
		message.text = 'r u online?';
		result = await chat_service.addMessage(message);
		expect(STATUS.OK);
		result = await chat_service.getMessages('Juncheng Zeng', 'Yunic', new Date().getTime());
		console.table(result.data);
		result = await chat_service.readMessage('Yunic', 'Juncheng Zeng');
		expect(STATUS.OK);
		result = await chat_service.getRecentChatList('Yunic');
		console.table(result.data);
		result = await chat_service.getMessages('Yunic', 'Juncheng Zeng', new Date().getTime());
		console.table(result.data);
		result = await chat_service.readMessage('Juncheng Zeng', 'Yunic');
		expect(STATUS.OK);
		result = await chat_service.readMessage('Juncheng Zeng', 'No one');
		expect(STATUS.REJECT);
		result = await chat_service.getRecentChatList('Yunic');
		console.table(result.data);
		[ message.sender, message. receiver ] = [ message.receiver, message.sender ];
		message.text = 'yes';
		result = await chat_service.addMessage(message);
		expect(STATUS.OK);
		message.text = 'of course';
		result = await chat_service.addMessage(message);
		expect(STATUS.OK);
		result = await chat_service.readMessage('Yunic', 'Juncheng Zeng');
		expect(STATUS.OK);
		result = await chat_service.getMessages('Yunic', 'Juncheng Zeng', new Date().getTime());
		console.table(result.data);
		[ message.sender, message.receiver ] = [ message.receiver, message.sender ];
		message.text = 'Lets count!';
		await chat_service.addMessage(message);
		await chat_service.readMessage(message.sender, message.receiver);
		[ message.sender, message.receiver ] = [ message.receiver, message.sender ];
		message.text = 'You first!';
		await chat_service.addMessage(message);
		await chat_service.readMessage(message.sender, message.receiver);
		for (let i = 0; i < 20; i++) {
			[ message.sender, message.receiver ] = [ message.receiver, message.sender ];
			message.text = i + '';
			await chat_service.addMessage(message);
			await chat_service.readMessage(message.sender, message.receiver);
		}
		result = await chat_service.getMessages('Yunic', 'Juncheng Zeng', new Date().getTime());
		console.table(result.data);
		message.text = '...';
		await chat_service.addMessage(message);
		message.text = 'hello?';
		await chat_service.addMessage(message);
		result = await chat_service.getMessages('Yunic', 'Juncheng Zeng', new Date().getTime());
		console.table(result.data);
		result = await chat_service.getRecentChatList('Yunic');
		console.table(result.data);
		result = await chat_service.getRecentChatList('Juncheng Zeng');
		console.table(result.data);
		await friend_service.applyUserToBeFriend('Juncheng Zeng', 'H3CO3');
		await friend_service.accessUserToBeFriend('H3CO3', 'Juncheng Zeng');
		await friend_service.applyUserToBeFriend('Juncheng Zeng', 'ZZ');
		await friend_service.accessUserToBeFriend('ZZ', 'Juncheng Zeng');
		await friend_service.applyUserToBeFriend('Juncheng Zeng', 'ZYF');
		await friend_service.accessUserToBeFriend('ZYF', 'Juncheng Zeng');
		message = {
			sender: 'Juncheng Zeng',
			receiver: 'H3CO3',
			text: 'Hello World!',
			time: new Date().getTime()
		};
		await chat_service.addMessage(message);
		message.receiver = 'ZZ';
		message.time = new Date().getTime();
		await chat_service.addMessage(message);
		message.receiver = 'ZYF';
		message.time = new Date().getTime();
		await chat_service.addMessage(message);
		result = await chat_service.getRecentChatList('Juncheng Zeng');
		console.table(result.data);
		result = await chat_service.getRecentChatList('ZZ');
		console.table(result.data);
	}

	test_chat_service();
}

/**
 * Expose services
 */
module.exports = {
	UserService: UserService,
	FriendService: FriendService,
	ChatService: ChatService
}
