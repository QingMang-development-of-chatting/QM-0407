//Module Dependencies
const insertChat = require('../query/chatInsert.js');

//API
const MsgService = {};

/**
 * msg直接存入DB。暂时时来一条传一条。
 * TODO：增加缓存
 * @param {String} id
 * @param {object} msg      eg.{"sender":"0002","room_id":"1","text":"test"}
 * @return {Boolean}
 */
MsgService.insertChat = async function (msg){
    let sender = msg.sender;
    let text = msg.text;
    let room_id = msg.room_id;
    var status = await insertChat({"id":sender,"room_id":room_id,"chat":[text]});	
    if(!status){
        return false;
    }
    return true;
}

module.exports =MsgService;


