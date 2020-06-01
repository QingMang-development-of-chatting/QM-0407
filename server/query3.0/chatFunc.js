/**
 * 
 */
const axios = require('axios');

 /**
 * 上传聊天记录
 * 关于时间 会在云端直接计算
 * 关于chat_id 也会在云端直接计算
 * 
 * 输入：
 * --info.host_id (string) 用户账号
 *   info.chat (Array["text1", "text2"..]) 聊天内容
 *   info.room (string) 聊天室
 * 输出：
 * --200 成功
 * --400 room不存在
 */
const insertChat = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/newChat',
        {    
            host: info.host_id,
            chat: info.chat,
            room: info.room,
        }
    ).then(function(response){
        status = response.data;
        
        console.log(status);
        result = status;
    })

    return result;
}

/**
 * insertRoom 新建房间
 * 输入：
 * --info.host_id 群主
 *   info.user_id <Array>群成员，不包括群主 
 * 输出：
 * --result.room_id 分配房间号
 */
const insertRoom = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/newRoom',
        {    
            host_id: info.host_id,
            user_id: info.user_id,
        }
    ).then(function(response){
        status = response.data;

        if (status == 400)
        {
            console.log(400);
            result = 400;
        }
        else
        {
            console.log(200);
            console.log(status);
            result = status;
        }
        
    })

    return result;
}

/**
 * 已读操作
 * 阅读一条指定的chat
 * 根据时间，阅读重置所有已读
 * 读一条消息=全部已读
 * 输入：
 * --info.user_id
 *   info.room_id
 * 输出：
 * --<Array>JSON
 *   result.host_id 发言人
 *   result.room_id
 *   result.chat
 *   result.user_read <Array>
 *   result.date
 * --401 没有已读消息
 */
const readChat = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/tmp',
        {    
            user_id: info.user_id,
            room_id: info.room_id,
        }
    ).then(function(response){
        status = response.data;        
        
        console.log(status);
        result = status;
    })

    return result;
}

/**
 * 查询聊天记录
 * 每查一次显示六分钟(随便改啦)
 * 
 * 输入：
 * --info.user_id (string) 用户账号
 *   info.room                      ————如果没有↓按照room输出
 *   可选：
 *   info.key (string) 关键字        ————按关键字搜索
 *   info.date (Date.getTime) 时间   ————按时间搜索
 *   info.new 如果=1，则输出一条此room的最新消息
 * 输出：
 * --401：没有查到记录
 * --[{host_id:"id", chat:"chat", data:"Date.getTime"}...]
 *   result[i].host_id 用户ID
 *   result[i].chat 信息
 *   result[i].date 需要转换回去的自1970年1月1日以来的毫秒数
 *   result[i].user_read 已经阅读本消息的人
 * --搜索第一条记录，返回的不是列表，其余同↑
 */
const searchChat = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchChat',
        {    
            id: info.user_id,
            key: info.key,
            date: info.date,
            room: info.room,
            new: info.new,
        }
    ).then(function(response){
        status = response.data;
        console.log(status);

        if (status == 401)
        {
            /**
             * 一条都么有读到记录
             */
            console.log(401);
            result = 401;
        }
        else
        {
            /**
             * 返回记录
             * promise格式：
             * [{host_id:"id", chat:"chat", data:"Date.getTime"}...]
             */
            console.log(200);
            result = status;
        }
    })

    return status;
}

/**
 * searchRoom 查找房间信息
 * 输入
 * --info.room_id 按房间号查找信息
 * --info.host_id 输出该用户的所有房间号
 * --info.user_id <Array> (可选)根据精准的user+host找房间
 * 输出
 * --result.room_id
 *   result.host_id
 *   result.user_id <Array>
 * --401 没有匹配结果
 */
const searchRoom = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchRoom',
        {    
            host_id: info.host_id,
            user_id: info.user_id,
            room_id: info.room_id,
        }
    ).then(function(response){
        status = response.data;    
        
        if (status == 401)
        {
            console.log(401);
            result = 401;
        }
        else
        {
            console.log(200);   
            result = status;
            console.log(result);
        }
    })

    return result;
}


exports.searchChat = searchChat;
exports.searchRoom = searchRoom;
exports.insertRoom = insertRoom;
exports.insertChat = insertChat;
exports.readChat = readChat;
