/**
 * Module dependencies
 */
//query
const friendFunc = require('../query3.0/friendFunc.js');
const addFriend = require('../query3.0/addFriend.js');
//constant
const { NOTIFICATION, SERVICE: { STATUS: STATUS }, REASON } = require('../constant');



/**
 * `Service` constructor
 *
 * @api public
 */
function Service() {}

/**
 * 获取username用户的friends
 * Examples:
 *
 *   service.getFriends('Steve Jobs');
 *
 * @param {String} username
 * @return {Object{status, data}} for result
 * @api public
 */
Service.prototype.getFriends = async function(username) {
	var result = await friendFunc.searchFriend({"host_id":username});
	var friend_array = [];	//格式：[friendname(String)](Array)
	//没找到friend
    if(result==401){    
        console.log("没找到friend");
		return { status: STATUS.OK, data:[]};	//返回空数组
	}
	//构造数组
    for(i = 0;i<result.length;i++){    //转化为array形式
        friend_array.push(result[i]["friend_id"]);
    }
	return { status: STATUS.OK, data: friend_array};
};

/**
 * 获取好友申请
 *
 * Examples:
 *
 *   service.getNotification('Steve Jobs');
 *
 * @param {String} username
 * @return {Object{status, reason|data}} for result
 * @api public
 */
Service.prototype.getNotification = async function(username) {
	var result = await addFriend.readRequest({"host_id":username});
    if(result == 305){  //没有申请者，返回空列表
        console.log("无申请者");
        return { status: STATUS.OK,data:[] };
	}
	//格式[{sender(String), type(see below)}](Array)
    var friend_request_array = [];
    for(i = 0;i<result.length;i++){ //调整格式
		var rqs = {};
		rqs.sender = result[i]["friend_id"]
        var answer = result[i]["answer"];
		if(answer==301){        //已接受
			console.log("已接受");
            rqs.type = NOTIFICATION.TYPE.ACCESS;  
		}else if(answer==302){  //已拒绝
			console.log("已拒绝");
            rqs.type = NOTIFICATION.TYPE.REJECT;  
		}else if(answer==300){  //未处理
			console.log("未处理");
            rqs.type = NOTIFICATION.TYPE.APPLY;  
        }else{
            console.log("出错");
        }
        friend_request_array.push(rqs);
	}
	return { status: STATUS.OK, data: friend_request_array };
};

/**
 * 发送好友申请
 * TODO？不含检测responser存在性的功能
 * Examples:
 *
 *   service.applyUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.applyUserToBeFriend = async function(requester, responser) {
	if (requester === responser) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.SAME_USER };
	}
	//query
	var result = await addFriend.sendRequest({"host_id":requester,"friend_id":responser});
	if(result==401){
        console.log("已经在好友列表里");
        return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.ALREADY_FRIENDS };
	}
	if(result==402){
        console.log("重复申请，更新时间并返回提示");
        return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.RESENT };
	}
	if(result==200){
		console.log("对方已发送申请，这里直接加为好友");
		await friendFunc.insertFriend({"host_id":responser,"friend_id":requester});
		return { status: STATUS.REJECT, reason: REASON.FRIEND.SEND_APPLY.MULT_ROLES }
	}
	console.log("成功发送申请");
    return { status: STATUS.OK };

};

/**
 * 接受好友申请，并添加好友
 * TODO? 无用户不存在的检测
 * Examples:
 *
 *   service.accessUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.accessUserToBeFriend = async function(responser, requester) {
	if (responser === requester) {
		console.log("responser和requester重名")
		return { status: STATUS.REJECT, reason: REASON.FRIEND.ACCESS.SAME_USER };
	}
	var result = await addFriend.sendAnswer({"host_id":responser,"friend_id":requester,"answer":301});
	if (result==400){
		console.log("请求不存在");	
		return { status: STATUS.REJECT, reason: REASON.FRIEND.ACCESS.NO_SUCH_APLLICANT };
	}
	//双方添加好友，并创建房间
	var result1 = await friendFunc.insertFriend({"host_id":responser,"friend_id":requester});
	if(result1==405){
		console.log("好友已存在列表中");	
	}
	console.log("成功接受该好友申请");
	return { status: STATUS.OK };
};

/**
 * 拒绝好友申请
 * TODO? 无用户不存在的检测
 * Examples:
 *
 *   service.accessUserToBeFriend('Steve Jobs', 'Tim Cook');
 *
 * @param {String} requester
 * @param {String} responser
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.rejectUserToBeFriend = async function(responser, requester) {
	if (responser === requester) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.REJECT.SAME_USER };
	}
	var result = await addFriend.sendAnswer({"host_id":responser,"friend_id":requester,"answer":302});
	if (result==400){
		console.log("请求不存在");	
		return { status: STATUS.REJECT, reason: REASON.FRIEND.REJECT.NO_SUCH_APLLICANT };
	}
	console.log("成功拒绝该好友申请");
	return { status: STATUS.OK };
};

/**
 * 删除好友。仅修改friend_info表。
 *
 * Examples:
 *
 *   service.deleteFriend('Steve Jobs', 'Wozniak');
 *
 * @param {String} username1
 * @param {String} username2
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.deleteFriend = async function(username1, username2) {
	if (username1 === username2) {
		return { status: STATUS.REJECT, reason: REASON.FRIEND.DELETE.SAME_USER };
	}
	//query
	var result = await friendFunc.deleteFriend({"host_id":username1,"friend_id":username2});
    if(result==200){
        console.log("删除成功");
        return { status: STATUS.OK };
    }else{
		console.log("删除失败,没这个朋友");
		return { status: STATUS.REJECT, reason: REASON.FRIEND.DELETE.NO_SUCH_FRIEND };
    }
};

/**
 * Expose `Service`
 */
module.exports = Service;

//Service.prototype.getFriends("444");
//Service.prototype.getNotification("0001");
//Service.prototype.applyUserToBeFriend('test_user1', 'test_user2');
//Service.prototype.accessUserToBeFriend("0001","0001");
//Service.prototype.rejectUserToBeFriend("0001","0003")
//Service.prototype.deleteFriend("0001","0004");
