//Module Dependencies
const chatFunc = require('../query3.0/chatFunc.js');
const friendService = require('../service/friendService.js');

//API
const MsgService = {};

/**
 * msg存入DB。暂时来一条传一条。
 * @param {String} user_id
 * @param {String} friend_id
 * @param {object} msg      {"text":"balabala"}
 * @return {Boolean}
 */
MsgService.insertChat = async function (user_id,friend_id,msg){
    //user_id,friend_id------room   
    var res = await chatFunc.searchRoom({"user_id":[user_id,friend_id]});
    if(res==401||res==310){  //如果room不存在，则创建room
        console.log("room不存在，创建room");
        var res = await chatFunc.insertRoom({"host_id":user_id,"user_id":[friend_id]});
        if(res==400){
            console.log("创建失败");
            return false;
        }
    }
    var room_id = res[0].room_id;
    console.log(room_id);
    
    //插入chat  
    var status = await chatFunc.insertChat({"host_id":user_id,"room":room_id,"chat":[msg["text"]]});	
    return true;
}

/**
 * 获取与指定用户所有聊天记录
 * 用户1账号，用户2账号------（消息内容，年月日时分，是否已读）
 * TODO 真的需要获取是否是好友吗？
 * @param {String} user_id
 * @param {String} friend_id
 * @return {Array{msg:,time:,read}}      （消息内容，年月日时分，是否已读）
 */
MsgService.getAllMsgByFriend = async function (user_id,friend_id){
    //user_id,friend_id------room   
    var res = await chatFunc.searchRoom({"user_id":[user_id,friend_id]});
    if(res==401||res==310){  //如果room不存在
        console.log("不存在消息记录");
        return [];
    }
    var room_id = res[0].room_id;

    //尝试获取消息记录
    var result = await chatFunc.searchChat({"room":room_id});
    var msgs = [];
    for(i=0;i<result.length;i++){
        var temp = {};
        temp.msg = result[i].chat;
        temp.time = result[i].createdAt;
        temp.read = false;
        var readlist = result[i].user_read;
        for(j = 0;j<readlist.length;j++){
            if(user_id==readlist[j]){
                temp.read = true;
                break;
            }
        }
        msgs.push(temp);
    }
    return msgs;
}

/**
 * 获取与用户聊过天的所有好友的最近的一条聊天记录
 * @param {String} user_id
 * @return {Array{friend_id:,msg:,time:,read:}}      （好友账号，消息内容，年月日时分,已读）列表
 */
MsgService.getLatestMsg_eachFriend = async function (user_id){
    //获取user的所有好友
    var friends = await friendService.getFriendArray(user_id);
    //对每个获取room
    var rooms = [];
    for(i = 0;i<friends.length;i++){
        var res = await chatFunc.searchRoom({"user_id":[user_id,friends[i]]});
        if(res==401||res==310){  //如果room不存在
            continue;
        }
        var room_id = res[0].room_id;
        rooms.push(room_id);
    }
    //获取每个room的最新一条chat
    var latestMsg_eachfriend = [];
    for(i = 0;i<rooms.length;i++){
        var result = await chatFunc.searchChat({"room":rooms[i],"new":1});
        var temp = {};
        temp.msg = result.chat;
        temp.time = result.createdAt;
        temp.friend_id = friends[i];
        temp.read = false;
        var readlist = result.user_read;
        for(j = 0;j<readlist.length;j++){
            if(user_id==readlist[j]){
                temp.read = true;
                break;
            }
        }    
        latestMsg_eachfriend.push(temp);
    }
    return latestMsg_eachfriend;
}

module.exports =MsgService;

//MsgService.insertChat("444","333",{"text":"66666"});
//MsgService.getAllMsgByFriend("test_user1","0004");
//MsgService.getLatestMsg_eachFriend("444");


