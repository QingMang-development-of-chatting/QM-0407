/**
 * 更改用户信息
 * 
 * 输入：
 * --info.user_id (string) 用户账号
 * 可选输入：
 * --info.user_key (string) 用户密码
 *   info.user_name (string) 用户名字
 *   info.user_photo (string) 用户头像
 * 
 * return: 
 * --false: 奇怪的bug
 * --401: 用户不存在
 * --result.user_id: 用户账号
 *   result.user_name: 用户名
 *   redult.user_photo
 */
const axios = require('axios');
const updUser = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/updUser',
        {    
            id: info.user_id,
            key: info.user_key,
            name: info.user_name,
            photo: info.user_photo
        }
    ).then(function(response){
        status = response.data;
        //console.log(status);
        if (status == 402)
        {
            /**
             * 用户不存在
             * code:402
             */
            console.log(402);
            result = 402;
        }
        else
        {
            /**
             * 成功
             * code:200
             */
            console.log(200);
            result = status;
        }
    })

    return result;
}

module.exports = updUser;
updUser({
    "user_id": "0080",
    "user_key": "123456",
    "user_name": "2111",
  });