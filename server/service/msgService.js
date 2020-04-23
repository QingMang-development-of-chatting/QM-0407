//Module Dependencies
const insertChat = require('../query/chatInsert.js');

//API
const MsgService = {};

/**
 * msg直接存入DB
 * @param {String} id
 * @param {object} msg
 * @return {Boolean}
 */
MsgService.insertChat = async function (id,msg){
    var status = await insertChat({"id":id,"chat":msg});	
    if(!status){
        return false;
    }
    return true;
}

module.exports =MsgService;

