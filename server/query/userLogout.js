/**
 * 用户登出
 * 和登录一模一样的冗余代码
 * 待改
 * 
 * 输入: 
 * --info.id (string) 用户账号
 * 输出：
 * --388: 出现bug
 * --400: 用户名或者密码错误
 * --403: 用户已登录
 * --result.id: 用户账号
 *   result.name: 用户名
 */
const axios = require('axios');
const logout = async function(info) {
    result = 388;

    await axios.post(
        'https://afusuj.toutiao15.com/logout',
        {    
            id: info.id,
        }
    ).then(function(response){
        let status = response.data;
        if (status == 0)
        {
            /**
             * 用户名或密码错误
             * code:400
             */
            console.log(400);
            result = 400;
        }
        else if (status == -1)
        {
             /**
             * 用户未登录
             * code:403
             */
            console.log(403);
            result = 403;
        }
        else
        {
            /**
             * 登出成功
             * code:200
             */
            console.log(status + " 200");
            result = status;
        }
    })

    return result;
};

module.exports = logout;
