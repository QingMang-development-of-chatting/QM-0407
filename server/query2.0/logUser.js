/**
 * 用户登录
 * 输入账号和密码→数据库查询账号密码是否存在→跳转登录(3)
 * 数据库返回user(obj)
 * 直接根据key的存在与否判断是登录还是登出
 * 
 * 输入: 
 * --info.user_id (string) 用户账号
 *   info.user_key (string) 用户密码 ————仅在登录时传入key
 * 输出：
 * --388: 出现bug
 * --400: 用户名
 * --401: 密码错误
 * --403: 用户已登录
 * --result.user_id: 用户账号
 *   result.user_name: 用户名
 *   result.online: 用户登录状态码
 */
const axios = require('axios');
const logUser = async function(info) {
    result = 388;   

    /**
     * 登出的时候info没有key
     */
    if (info.key == null || info.key == "")
    {
        info.key = "";
    }

    await axios.post(
        'https://afusuj.toutiao15.com/logUser',
        {    
            id: info.id,
            key: info.key,
        }
    ).then(function(response){
        let status = response.data;
        if (status == 402)
        {
            /**
             * 用户名不存在
             * code:400
             */
            console.log(402);
            result = 402;
        }
        else if (status == 401)
        {
            /**
             * 密码错误
             * code:401
             */
            console.log(401);
            result = 401;
        }
        else if (status == 403)
        {
            /**
             * 用户已登录
             * code:403
             */
            console.log(403);
            result = 403;
        }
        else
        {
            /**
             * 登录成功
             * code:200
             */
            console.log(200);
            console.log(status);
            result = status;
        }
    })
    
    return result;
};

module.exports = logUser;
