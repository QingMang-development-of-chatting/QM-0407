/**
 * insertFriend 添加好友，同时添加2人群聊
 * searchFriend 显示整个好友列表
 * deleteFriend 删除好友
 */
const axios = require('axios');

 /**
 * 添加好友信息
 * 每次添加，host和friend对调双边添加，千万别两边都调用
 * 输入：
 * --info.host_id 当前用户的id
 *   info.friend_id 想要添加的用户的id
 * 输出：
 * --result.host_id
 *   result.friend_id
 * --405好友已存在列表中
 */
const insertFriend = async function(info) {
    if (info.host_id == null || info.friend_id == null)
    {
        return 400;
    }
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/newFriend',
        {    
            host: info.host_id,
            friend: info.friend_id,
        }
    ).then(function(response){
        status = response.data;

        if (status == 405)
        {
            /**
             * 好友已存在列表中
             */
            //console.log(405);
            result = 405;
        }
        else
        {
            /**
             * 添加成功
             */
            result = status;
        }
    })

    return result;
}


/**
 * 查找用户的所有好友信息
 * 输入：
 * --info.host_id 当前用户的id
 * 输出：
 * --<Array>JSON
 *   result[i].host_id    
 *   result[i].friend_id  
 */

const searchFriend = async function(info) {
    if (info.host_id == null && info.room_id == null)
    {
        return 400;
    }
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchFriend',
        {    
            host: info.host_id,
            friend: info.friend_id,
            room_id: info.room_id,
        }
    ).then(function(response){
        status = response.data;

        if (status == 401)
        {
            /**
             * 啥也找不到
             */
            //console.log(401);
            result = 401;
        }
        else
        {
            /**
             * 返回结果
             */
            //console.log(200);
            //console.log(status);
            result = status;
        }
    })

    return result;
}

/**
 * 删除好友
 * 输入：
 * --info.host_id (string) 用户账号
 *   info.friend_id
 * return: 
 * --401: 好友不存在
 * --200: 删除成功
 */
const deleteFriend = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/deleteFriend',
        {    
            host: info.host_id,
            friend: info.friend_id,
        }
    ).then(function(response){
        status = response.data;
        if (status == 401)
        {
            /**
             * 用户不存在 & 其他错误
             * code:401
             */
            //console.log(401);
            result = 401;
        }
        else
        {
            /**
             * 成功
             * code:200
             */
            //console.log(200);
            result = 200;
        }
    })

    return result;
}

exports.deleteFriend = deleteFriend;
exports.searchFriend = searchFriend;
exports.insertFriend = insertFriend;