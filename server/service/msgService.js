//Module Dependencies
const insertChat = require('../query/chatInsert.js');

//API
const MsgService = {};

/**
 * msg直接存入DB。暂时时来一条传一条。
 * TODO：增加缓存
 * @param {String} id
 * @param {object} msg      eg.{"sender":"0002","text":"test"}
 * @return {Boolean}
 */
MsgService.insertChat = async function (msg){
    let sender = msg.sender;
    let text = msg.text;
    var status = await insertChat({"id":sender,"chat":[text]});	
    if(!status){
        return false;
    }
    return true;
}

module.exports =MsgService;

