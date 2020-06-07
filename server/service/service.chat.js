/**
 * Module dependencies
 */
//query
const chatFunc = require('../query3.0/chatFunc.js');
const friendService = require('../service/service.friend.js');	//TODO 这个要改成service.friend
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
 *
 * Examples:
 *
 *   service.getRecentChatList('...');
 *
 * @param {String} username
 * @return {Object{status, data}} for result
 * @api public
 */
Service.prototype.getRecentChatList = async function(username) {
	//获取user的所有好友	
	var friends = await friendService.prototype.getFriends(username);
	friends = friends.data;
	//对每个获取room
	var rooms = [];
	var len = friends.length;
    for(i = 0;i<friends.length;i++){
        var res = await chatFunc.searchRoom({"user_id":[username,friends[i]]});
		if(res==401||res==310){  //room不存在，即没聊过天，略过
			rooms.push(null);
            continue;
        }
        var room_id = res[0].room_id;
        rooms.push(room_id);
	}
	//获取每个room的最新一条chat，格式：[{ friend(String), last_text(String), last_time(Number), unread_cnt(Number), sender(String) }](Array)
    var data = [];
    for(i = 0;i<rooms.length;i++){
		if(rooms[i]==null){	//没聊过天的情况
			continue;
		}
		var result = await chatFunc.searchChat({"room":rooms[i]});
		var lastmsg = result[result.length-1];
		var temp = {};
		//最后一条信息相关
		temp.friend = friends[i];
        temp.last_text = lastmsg.chat;
		temp.last_time = lastmsg.date;
		temp.sender = lastmsg.host_id;
		//这个房间，username用户未读信息的数量
		temp.unread_cnt = 0;	
		for(ri=result.length-1;ri>=0;ri--){
			var readlist = result[ri].user_read;
			var findread = false;
			for(j = 0;j<readlist.length;j++){
				if(username==readlist[j]){
					findread = true;	//如果找到读了，就直接break
					break;
				}
			}
			if(findread){	//因为是按顺序的，如果找到读了，表示更早的也都读了。所以直接break
				break;
			}else{
				temp.unread_cnt+=1;
			}
		}
        data.push(temp);
	}
	//返回结果
	if(data.length==0){
		console.log("一条记录都没有")
		return { status: STATUS.NOT_FOUND };
	}
	//对数组按时间last_time递减排序（最后发的在最前面）
	data.sort(sortbytime);
	return { status: STATUS.OK, data:data };
};


/**
 * 根据u1、u2，获取指定时间之前的msgs
 * msgs的数量不超过20, is_read判断的是u1是否已读
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
	if(!isfriend){
		console.log("两个用户不是好友");
		return { status: STATUS.REJECT, reason: REASON.GET_HISTORY.NOT_FRIENDS };
	}

	//获取房间
    var res = await chatFunc.searchRoom({"user_id":[username1,username2]});
    if(res==401||res==310){  //如果room不存在
        console.log("不存在消息记录");
        return { status: STATUS.OK, data: [] };
    }
    var room_id = res[0].room_id;

    //尝试获取消息记录（TODO？时间的部分好像query有提供，可以改进一下）
    var result = await chatFunc.searchChat({"room":room_id});
    var msgs = [];	//格式适配：[{sender(String), text(String), time(Number), is_read(Boolean)}](Array)
	for(i=result.length-1;i>=0;i--){	//按照从新到旧的顺序
		if(msgs.length>=20){
			console.log("已获取20条msg，break");
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
		temp.is_read = false;	//判断username1用户是否已读
        var readlist = msg.user_read;
        for(j = 0;j<readlist.length;j++){
            if(username1==readlist[j]){
                temp.is_read = true;
                break;
            }
        }
        msgs.push(temp);
    }
    return { status: STATUS.OK, data: msgs };
};

/**
 * TODO插入msg，一条
 *
 * Examples:
 *
 *   service.addMessage('...');
 *
 * @param {Object} message
 * @param {String} message.sender
 * @param {String} message.receiver
 * @param {String} message.text
 * @param {Number} message.time
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.addMessage = async function(message) {
	const { sender, receiver, text, time } = message;
	if (sender === receiver) {
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.SAME_USER };
	}

	//获取房间
    var res = await chatFunc.searchRoom({"user_id":[sender,receiver]});
	if(res==401||res==310){  //如果room不存在，则创建room
        console.log("room不存在，创建room");
        var res = await chatFunc.insertRoom({"host_id":sender,"user_id":[receiver]});
    }
	var room_id = res[0].room_id;
	//case：room这部分有问题时
	if(!room_id){
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.NOT_FRIENDS };
	}
	
	// case：OK
	//TODO 需要插入时间。根据query调整格式
	var status = await chatFunc.insertChat({"host_id":user_id,"room":room_id,"chat":[msg["text"]]});
	return { status: STATUS.OK };
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
		return { status: STATUS.REJECT, reason: REASON.SEND_MESSAGE.SAME_USER };
	}
	//获取房间
    var res = await chatFunc.searchRoom({"user_id":[sender,receiver]});
    if(res==401||res==310){  //如果room不存在
        console.log("不存在消息记录");
        return { status: STATUS.REJECT, reason: REASON.SEND_READ_MESSAGE.NOT_FRIENDS};
    }
    var room_id = res[0].room_id;
	var res = await chatFunc.readChat({user_id:sender,room_id:room_id});
	if(res==401){	//case: 过去已经都已读了
		console.log("no msgs upd");
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

//Service.prototype.getRecentChatList("333");
//Service.prototype.getMessages("333","444",1590995796111);
//Service.prototype.readMessage("333","444");