/**
 * 添加好友信息
 * 提醒：每一次添加好友要为双方都添加一次，还是直接双方，是个好问题
 * 后续迭代：每次添加前确认一下好友存不存在
 * 
 * 输入：
 * --info.host_id 当前用户的id
 *   info.friend_id 想要添加的用户的id
 * 
 * 输出：
 * --200 添加成功
 *   405好友已存在列表中
 */

const axios = require('axios');
const insertFriend = async function(info) {
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
            console.log(405);
            result = 405;
        }
        else
        {
            /**
             * 添加成功
             */
            console.log(200);
            result = 200;
        }
    })

    return result;
}

module.exports = insertFriend;
insertFriend({
    "host_id": "0080",
    "friend_id": "0003"
});