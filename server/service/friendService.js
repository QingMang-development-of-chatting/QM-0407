//Module Dependencies
const friendFunc = require('../query3.0/friendFunc.js');
const addFriend = require('../query3.0/addFriend.js');

//API
const FriendService = {};

/**
 * 获取好友列表
 * @param   {String}    user_id
 * @return  {Array}     friend_array
 */
FriendService.getFriendArray= async function (user_id) {
    var result = await friendFunc.searchFriend({"host_id":user_id});
    var friend_array = [];
    if(result==401){    //没找到friend
        console.log("没找到friend");
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
    var result = await addFriend.readRequest({"host_id":user_id});
    if(result == 305){  //没有申请者，返回空列表
        console.log("无申请者");
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
    var result = await addFriend.sendRequest({"host_id":user_id,"friend_id":friend_id});
    console.log(result);
    if(result==300){
        console.log("成功发送申请");
        return true;
    }else if(result==401){
        console.log("已经在好友列表里");
        return false;
    }else if(result==402){
        console.log("已经申请过了");
        return false;
    }
    console.log("不明错误");
    return false;
};

/**
 * 删除好友
 * true/false = removeFriend(user_id, friend_id) 
 * @param   {String}    user_id
 * @param   {String}    friend_id
 * @return  {bool}      result
 */
FriendService.removeFriend= async function (user_id,friend_id) {
    var result = await friendFunc.deleteFriend({"host_id":user_id,"friend_id":friend_id});
    if(result==200){
        console.log("删除成功");
        return true;
    }else{
        console.log("删除失败");
        return false;
    }
};

/**
 * 通过/拒绝好友请求，扩列
 * true/false = accessFriend(user_id, friend_id，pass) 
 * @param   {String}    user_id     接收者，用户自己
 * @param   {String}    friend_id   发送者
 * @param   {bool}      pass        通过/拒绝
 * @return  {bool}      result
 */
FriendService.accessFriend= async function (user_id,friend_id,pass) {
    //接收方通过申请
    if (pass){
        var result = await addFriend.sendAnswer({"host_id":user_id,"friend_id":friend_id,"answer":301});
        if (result==400){
            console.log("系统错误/请求不存在/已经回应");
            return false;
        }
        //双方添加好友
        var result1 = await friendFunc.insertFriend({"host_id":user_id,"friend_id":friend_id});
        if(result1==405){
            console.log("好友已存在列表中");
            return false;
        }
        console.log("成功接受该好友申请");
        return true;
    }else if(pass==false){
        var result = await addFriend.answerFriend({"host_id":user_id,"friend_id":friend_id,"answer":302});
        if (result==400){
            console.log("系统错误/请求不存在/已经回应");
            return false;
        }
        console.log("成功拒绝该好友申请");
        return true;
    }else{
        console.log("出错");
        return false;
    }
};



module.exports = FriendService;
//FriendService.getFriendArray("0001");
//FriendService.getFriendRequest("444");
//FriendService.addFriend("333","444");
//FriendService.accessFriend("444","333",true);
//FriendService.removeFriend("0001","0003");