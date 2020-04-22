/**
 * 用户注册
 * 用户输入账号密码→数据库检测账号密码是否已存在(unique)→不存在则插入账号信息(insert)→页面跳转
 * get: info{id, key, name}
 * return: 
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
            result = false;
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
