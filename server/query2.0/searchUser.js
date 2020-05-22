/**
 * 查找对应id的用户
 * 
 * 输入：
 * --info.user_id 当前用户的id
 * 
 * 输出：
 * --result.user_id
 *   result.user_name
 *   result.user_photo
 *   result.online
 */

const axios = require('axios');
const searchUser = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchUser',
        {    
            id: info.user_id,
        }
    ).then(function(response){
        status = response.data;
        console.log(status);

        if (status == [] || status.user_id == null)
        {
            /**
             * 找不到用户
             */
            console.log(406);
            result = 406;
        }
        else
        {
            /**
             * 返回结果
             */
            console.log(200);            
            result = status;
        }
    })

    return result;
}

module.exports = searchUser;
searchUser({
    "user_id": "0080",
});