/**
 * 用户注册
 * 用户输入账号密码→数据库检测账号密码是否已存在(unique)→不存在则插入账号信息(insert)→页面跳转
 * 
 * 输入：
 * --info.user_id (string) 用户账号
 *   info.user_key (string) 用户密码
 *   info.user_name (string) 用户名字
 * return: 
 * --false: 奇怪的bug
 * --400：账号重名
 * --result.user_id: 用户账号
 *   result.user_name: 用户名
 */
const axios = require('axios');
const insertUser = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/newUser',
        {    
            id: info.user_id,
            key: info.user_key,
            name: info.user_name,
        }
    ).then(function(response){
        status = response.data;
        //console.log("response:" + status);
        if (status == 400)
        {
            /**
             * 账号重名，注册不成功
             * code:400
             */
            console.log(400);
            result = 400;
        }
        else
        {
            /**
             * 注册成功
             * code:200
             */
            console.log(200);
            result = status;
        }
    })

    return result;
}

module.exports = insertUser;
