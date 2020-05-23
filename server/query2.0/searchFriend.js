/**
 * 查找用户的所有好友信息
 * 
 * 输入：
 * --info.host_id 当前用户的id
 * 
 * 输出：
 * --result[i].host_id    用户id
 *   result[i].friend_id  好友id
 */

const axios = require('axios');
const searchFriend = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchFriend',
        {    
            host: info.host_id,
            friend: info.friend_id,
        }
    ).then(function(response){
        status = response.data;

        if (status[0] == null)
        {
            /**
             * 好友列表空空如也
             */
            console.log(407);
            result = 407;
        }
        else
        {
            /**
             * 返回结果
             */
            console.log(200);
            console.log(status);
            result = status;
        }
    })

    return result;
}

module.exports = searchFriend;
