//Module Dependencies
const searchUser = require('../query2.0/searchFriend.js');
const addFriend = require('../query2.0/addFriend.js');
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

module.exports = FriendService;
//FriendService.getFriendArray("0080");
//FriendService.getFriendRequest("0003");