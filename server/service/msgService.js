//Module Dependencies
const insertChat = require('../query2.0/chatInsert.js');
//const insertChat = require('../query/charSearch_byRoomid.js');

//API
const MsgService = {};

/**
 * msg直接存入DB。暂时时来一条传一条。
 * TODO：增加缓存
 * @param {String} room
 * @param {object} msg      eg.{"sender":"0002","text":"test"}
 * @return {Boolean}
 */
MsgService.insertChat = async function (room,msg){
    let sender = msg.sender;
    let text = msg.text;
    var status = await insertChat({"host_id":sender,"room":room,"chat":[text]});	
    if(!status){
        return false;
    }
    return true;
}

/**
 * TODO 获取与指定好友所有聊天记录
 * 用户账号，好友账号------（是否好友，消息内容，年月日时分，是否已读）
 * @param {String} user_id
 * @param {String} friend_id
 * @return {Array{isfriend:,msg:,time:,read}}      （是否好友，消息内容，年月日时分，是否已读）
 */
MsgService.getAllMsgByFriend = async function (user_id,friend_id){
    // var status = await insertChat({"host_id":sender,"room":room,"chat":[text]});	
    // if(!status){
    //     return false;
    // }
    // return true;
}

/**
 * TODO 获取与用户聊过天的所有好友的最近的一条聊天记录
 * @param {String} user_id
 * @return {Array{friend_id:,msg:,time:,}}      （好友账号，消息内容，年月日时分）列表
 */
MsgService.getLatestMsg_eachFriend = async function (user_id){
    // var status = await insertChat({"host_id":sender,"room":room,"chat":[text]});	
    // if(!status){
    //     return false;
    // }
    // return true;
}

// /**
//  * TODO按room_id查找msg
//  * @param {String} room
//  * @return msg
//  */
// MsgService.searchMsgByRoomid = async function (room){
//     //var result = await charSearch_byRoomid({"room_id":room_id});	
//     return result;
// }


module.exports =MsgService;


