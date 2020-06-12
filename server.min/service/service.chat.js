/**
 * Module dependencies
 */
//query
const chatFunc = require('../query3.0/chatFunc.js');
const friendService = require('../service/service.friend.js');	
const nlp = require('../nlp/nlp.singleton.js');	
//constant
const { SERVICE: { STATUS: STATUS }, REASON } = require('../constant');


/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

/**
 * 获取聊天的列表。
 * Examples:
 *
 *   service.getRecentChatList('...');
 *
 * @param {String} username
 * @return {Object{status, data}} for result
 * @api public
 */
Service.prototype.getRecentChatList = async function(username) {
	//直接query
	var res = await chatFunc.unreadRoom({"user_id":username})
	//获取每个room的最新一条chat，格式：[{ friend(String), last_text(String), last_time(Number), unread_cnt(Number), sender(String) }](Array)
    var data = [];
    for(i = 0;i<res.length;i++){
		var lastmsg = res[i];
		if(lastmsg.chat==0){	//这个房间没有消息
			continue;
		}
		var temp = {};
		//最后一条信息相关
		temp.friend = lastmsg.friend;
        temp.last_text = lastmsg.chat;
		temp.last_time = lastmsg.date;
		temp.sender = lastmsg.host_id;
		//这个房间，未读信息的数量
		temp.unread_cnt = lastmsg.f_num+lastmsg.num;		//自己的未读+对方的未读
        data.push(temp);
	}
	//返回结果
	if(data.length==0){	//一条记录都没有
		return { status: STATUS.NOT_FOUND };
	}
	//对数组按时间last_time递减排序（最后发的在最前面）
	data.sort(sortbytime);
	return { status: STATUS.OK, data:data };
};


/**
 * 根据u1、u2，获取指定时间之前的20条msgs
 * is_read判断消息的receiver是否已读
 *
 * Examples:
 *
 *   service.getMessages('...');
 *
 * @param {String} username1
 * @param {String} username2
 * @param {Number} time
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getMessages = async function(username1, username2, time) {
	if (username1 === username2) {
		return { status: STATUS.REJECT, reason: REASON.GET_HISTORY.SAME_USER };
	}
	//判断两者是否为好友
	var friends = await friendService.prototype.getFriends(username1);
	friends = friends.data;
	var isfriend = false;
	for(i = 0;i<friends.length;i++){
		if(friends[i]==username2){
			isfriend = true;
			break;
		}
	}
	if(!isfriend){	//两个用户不是好友
		return { status: STATUS.REJECT, reason: REASON.GET_HISTORY.NOT_FRIENDS };
	}

	//获取房间
    var res = await chatFunc.searchRoom({"user_id":[username1,username2]});
    if(res==401||res==310){  //如果room不存在。（正常不会出现这种情况）
        return { status: STATUS.OK, data: [] };
    }
    var room_id = res[0].room_id;

    //尝试获取消息记录
    var result = await chatFunc.searchChat({"room":room_id,"param":"date","param2":time,"n":20});
    var msgs = [];	//格式适配：[{sender(String), text(String), time(Number), is_read(Boolean),sentiment(Number)}](Array)
	for(i=0;i<result.length;i++){	//time递增
		if(msgs.length>=20){
			break;
		}
		var msg = result[i];
		var temp = {};
		if(msg.date>time){	//需要获取比指定时间更旧的msg
			continue;
		}
        temp.text = msg.chat;
		temp.time = msg.date;
		temp.sender = msg.host_id;
		temp.sentiment = msg.sentiment;
		//判断receiver是否已读（sender的反面）
		var receiver = username1;
		if(receiver===temp.sender){
			receiver=username2;
		}
		temp.is_read = false;	
        var readlist = msg.user_read;
        for(j = 0;j<readlist.length;j++){
            if(receiver==readlist[j]){
                temp.is_read = true;
                break;
            }
        }
        msgs.push(temp);
    }
    msgs = msgs.sort((message1, message2) => {
    	return message1.time - message2.time;
    });
    return { status: STATUS.OK, data: msgs };
};

/**
 * 
 * 插入一条msg
 *
 * Examples:
 *
 *   service.addMessage('...');
 *
 * @param {Object} message{sender(String)、receiver(String)、text(String)、time(Number)}
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.addMessage = async function(message) {
	const { sender, receiver, text, time } = message;
	if (sender === receiver) {
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.SAME_USER };
	}

	//获取房间
    var res = await chatFunc.searchRoom({"user_id":[sender,receiver]});
	if(res==401||res==310){  //case：不是朋友时
        return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.NOT_FRIENDS };
	}
	var room_id = res[0].room_id;
	//情感分析、文本敏感词过滤
	var senti = await nlp.sentiment(text);
	var ftext = await nlp.textfilter(text);
	//插入chat
	var status = await chatFunc.insertChat({"host_id":sender,"room":room_id,"chat":[ftext],"date":[time],"sentiment":[senti]});
	if(status==200){		// case：OK 携带一个data为{过滤后的text（string）和sentiment（Number）}
		return { status: STATUS.OK,data:{text:ftext,sentiment:senti} };
	}else{
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.NOT_FRIENDS };
	}
	
};

/**
 * 设置消息为已读。
 * （设置sender，receiver的room中的所有消息都为sender已读）
 *
 * Examples:
 *
 *   service.readMessage('...');
 *
 * @param {String} sender
 * @param {String} receiver
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.readMessage = async function(sender, receiver) {
	if (sender === receiver) {
		return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.SAME_USER };
	}
	//获取房间
    var res1 = await chatFunc.searchRoom({"user_id":[sender,receiver]});
    if(res1==401||res1==310){  //如果room不存在
        return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NOT_FRIENDS};
    }
    var room_id = res1[0].room_id;
	var res2 = await chatFunc.readChat({user_id:receiver,room_id:room_id});
	if(res2==401){	//case: 过去已经都已读了
		return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NO_UPDATE};
	}
	return { status: STATUS.OK }
};

/**
 * 私有函数
 * @api private
 */
function sortbytime(msg1,msg2){
    return msg2.last_time - msg1.last_time;
}


/**
 * Expose `Service`
 */
module.exports = Service;

//Service.prototype.getRecentChatList('test_user1');
//Service.prototype.getMessages('test_user1', 'test_user2', new Date().getTime());
//Service.prototype.readMessage('test_user2', 'test_user1');
//Service.prototype.addMessage({sender:"1234",receiver:"0001",text:"69",time:new Date().getTime()});