//Module Dependencies
const searchUser = require('../query2.0/searchFriend.js');
const addFriend = require('../query2.0/addFriend.js');
const insertFriend = require('../query2.0/insertFriend.js');
//API
const FriendService = {};

/**
 * 获取好友列表
 * @param   {String}    user_id
 * @return  {Array}     friend_array
 */
FriendService.getFriendArray= async function (user_id) {
    var result = await searchUser({"host_id":user_id});
    var friend_array = [];
    if(result==407){    //没有friend
		return [];
	}
    for(i = 0;i<result.length;i++){    //转化为array形式
        friend_array.push(result[i]["friend_id"]);
    }
    console.log(friend_array);
    return friend_array;
};

/**
 * 获取好友申请信息 
 * 账号→（申请者账号，处理情况（-1已拒绝，0未处理，1:已接受））列表
 * @param   {String}    user_id
 * @return  {Array{applicant:,answer:}}     friend_request_array
 */
FriendService.getFriendRequest= async function (user_id) {
    var result = await addFriend.askFriend({"host_id":user_id});
    // * 300 申请好友
    // * 301 申请通过
    // * 302 申请不通过
    // * 303 id匹配出错
    // * 304 其他错误
    // * 305 无待处理好友申请
    if(result == 305){  //没有申请者，返回空列表
        return [];
    }
    friend_request_array = [];
    for(i = 0;i<result.length;i++){ //调整格式
        var rqs = {"applicant":result[i]["friend_id"]};
        var answer = result[i]["answer"];
        if(answer==301){        //已接受
            rqs["answer"] = 1;  
        }else if(answer==302){  //已拒绝
            rqs["answer"] = -1;  
        }else if(answer==300){  //未处理
            rqs["answer"] = 0;  
        }else{
            console.log("出错");
        }
        friend_request_array.push(rqs);
    }
    return friend_request_array;
};

/**
 * 发送添加好友请求
 * true/false = addFriend(user_id, friend_id) 
 * @param   {String}    user_id     发送者，自己
 * @param   {String}    friend_id
 * @return  {bool}      result
 */
FriendService.addFriend= async function (user_id,friend_id) {
    var result = await addFriend.askHost({"host_id":user_id,"friend_id":friend_id});
    console.log(result);
    if(result==300){
        console.log("已发送申请");
        return true;
    }else if(result==303){
        console.log("已有请求");
    }
    console.log("出错");
    return false;
};

/**
 * TODO 删除好友并发送给被删的用户提示
 * true/false = removeFriend(user_id, friend_id) 
 * @param   {String}    user_id
 * @param   {String}    friend_id
 * @return  {bool}      result
 */
FriendService.removeFriend= async function (user_id,friend_id) {

};

/**
 * 通过/拒绝好友请求，扩列并发送提示给发起人 
 * true/false = accessFriend(user_id, friend_id，pass) 
 * @param   {String}    user_id     接收者，用户自己
 * @param   {String}    friend_id   发送者
 * @param   {bool}      pass        通过/拒绝
 * @return  {bool}      result
 */
FriendService.accessFriend= async function (user_id,friend_id,pass) {
    //接收方通过申请
    if (pass){
        var result = await addFriend.answerFriend({"host_id":user_id,"friend_id":friend_id,"answer":301});
        if (result==303||result==304){
            console.log("申请不存在/不止一条待处理/已处理/bug");
            return false;
        }
        //双方添加好友
        var result1 = await insertFriend({"host_id":user_id,"friend_id":friend_id});
        if(result1==405){
            console.log("好友已存在列表中");
            return false;
        }
        console.log("成功接受该好友申请");
        return true;
    }else if(pass==false){
        var result = await addFriend.answerFriend({"host_id":user_id,"friend_id":friend_id,"answer":302});
        console.log("成功拒绝该好友申请");
        return true;
    }else{
        console.log("出错");
        return false;
    }
};



module.exports = FriendService;
//FriendService.getFriendArray("0080");
//FriendService.getFriendRequest("0003");
//FriendService.addFriend("33333","444");
//FriendService.accessFriend("444","33333",true);