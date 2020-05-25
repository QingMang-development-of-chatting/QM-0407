//Module Dependencies
const searchUser = require('../query2.0/searchFriend.js');
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
 * TODO获取好友申请信息 等query
 * 账号→（申请者账号，处理情况（-1已拒绝，0未处理，1:已接受））列表
 * @param   {String}    user_id
 * @return  {Array{applicant:,status:}}     friend_request_array
 */
FriendService.getFriendRequest= async function (user_id) {

};

module.exports = FriendService;
//FriendService.getFriendArray("0080");