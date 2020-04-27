//Module Dependencies
const insertChat = require('../query/chatInsert.js');
//const insertChat = require('../query/charSearch_byRoomid.js');

//API
const MsgService = {};

/**
 * msg直接存入DB。暂时时来一条传一条。
 * TODO：增加缓存
 * @param {String} room_id
 * @param {object} msg      eg.{"sender":"0002","text":"test"}
 * @return {Boolean}
 */
MsgService.insertChat = async function (room_id,msg){
    let sender = msg.sender;
    let text = msg.text;
    var status = await insertChat({"id":sender,"room_id":room_id,"chat":[text]});	
    if(!status){
        return false;
    }
    return true;
}

/**
 * 按room_id查找msg
 * @param {String} room_id
 * @return msg
 */
MsgService.searchMsgByRoomid = async function (room_id){
    //var result = await charSearch_byRoomid({"room_id":room_id});	
    return result;
}

module.exports =MsgService;


