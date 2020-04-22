/**
 * 用户注册
 * 用户输入账号密码→数据库检测账号密码是否已存在(unique)→不存在则插入账号信息(insert)→页面跳转
 * 
 * 输入：
 * --info.id (string) 用户账号
 *   info.key (string) 用户密码
 *   info.name (string) 用户名字
 * return: 
 * --false: 奇怪的bug
 * --400：账号重名
 * --result.id: 用户账号
 *   result.name: 用户名
 */
const axios = require('axios');
const insertUser = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/ifUserUnique',
        {    
            id: info.id,
            key: info.key,
            name: info.name,
        }
    ).then(function(response){
        status = response.data;
        //console.log("response:" + status);
        if (status == -1)
        {
            /**
             * 账号重名，注册不成功
             * code:400
             */
            //console.log("error:" + status + " 400");
            result = 400;
        }
        else
        {
            /**
             * 注册成功
             * code:200
             */
            //console.log("insert id:" + status.result.user_id + " 200");
            result = status;
        }
    })

    return result;
}

module.exports = insertUser;
