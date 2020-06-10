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
 *   info.date (Array["date1", "date2"..]) 聊天时间，推荐使用getTime函数转换一下
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
            date: info.date,
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
            console.log(status);
            result = status;
        }
        
    })

    return result;
}

/**
 * 已读操作
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
 *   info.room                     
 *   info.param 候选词：key按关键字正则搜索，date输出给定时间的前(20)条信息，
 *                     date1输出给定时间前后(三小时)的所有信息
 *                     room输出该房间所有的聊天信息
 *   info.param2 备选参数，仅对于date和date2起作用，在此输入getTime()时间
 * 输出：
 * --401：没有查到记录
 * --[{host_id:"id", chat:"chat", data:"Date.getTime"}...]
 *   result[i].host_id 用户ID
 *   result[i].chat 信息
 *   result[i].date 需要转换回去的自1970年1月1日以来的毫秒数
 *   result[i].user_read 已经阅读本消息的人
 */
const searchChat = async function(info) {
    if (info.room == null)
    {
        return 400;
    }
    if (info.param != "key" || info.param != "room" 
        || info.param != "date" || info.param != "date1")
    {
        return 400;
    }
    if ((info.param == "date" || info.param == "date2") && (!Number(info.param2)))
    {
        return 400;
    }

    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchChat',
        {    
            id: info.user_id,
            room: info.room,
            param: info.param,
            param2: info.param2,
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
 * 首页返回
 * 返回每个房间一条消息和未读消息数
 * 输入：
 * --info.user_id
 * 返回:
 * --Array()
 *   --result[i].room_id
 *     result[i].num
 *     result[i].chat  最后一条消息
 *     **如果num=chat=0
 *     **意味着该房间没有任何消息记录
 *     **下面几项都不会进行返回
 *     result[i].host_id 最后一条消息的发言人
 *     result[i].date 发言时间，这里没有做时间排序
 *                             请前端或者service辛苦一下
 * --400查找的用户不在user_info库
 */
const unreadRoom = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/tread',
        {    
            user_id: info.user_id,
        }
    ).then(function(response){
        status = response.data; 
        result = status;
        console.log(result);
    });

    return result;
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
exports.unreadRoom = unreadRoom;
