/**
 * 和room相关的函数, 调用同addfriend
 * insertRoom & searchRoom
 */

const axios = require('axios');

/**
 * insertRoom 新建房间
 * 输入：
 * --info.host_id 群主
 *   info.user_id <Array>
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
        console.log(200);
        console.log(status);
        result = status;
    })

    return result;
}

/**
 * searchRoom 查找房间信息
 * 输入
 * --info.room_id 按房间号查找信息
 * --info.host_id 按用户信息查找信息 
 *   info.user_id <Array>
 * 输出
 * --result.room_id
 *   result.host_id
 *   result.user_id <Array>
 * --310 没有匹配结果
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
        
        if (status == 310)
        {
            console.log(310);
            result = 310;
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

exports.searchRoom = searchRoom;
exports.insertRoom = insertRoom;


