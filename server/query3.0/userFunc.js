/**
 * insertUser 新建账户
 * updUser    更改账户信息，包括昵称\密码\头像
 * logUser    登录与登出
 * 调用方法同理
 */
const axios = require('axios');

 /**
 * 用户注册
 * 
 * 输入：
 * --info.user_id (string) 用户账号
 *   info.user_key (string) 用户密码
 *   info.user_name (string) 用户名字
 * return: 
 * --result.user_id: 用户账号
 *   result.user_name: 用户名
 * --false: 系统错误
 * --401：账号已经被注册
 */

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
        if (status == 401)
        {
            /**
             * 账号重名，注册不成功
             * code:400
             */
            console.log(401);
            result = 401;
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


/**
 * 更改用户信息
 * 可以同时改变key\name\photo中的任意个
 * 
 * 输入：
 * --info.user_id (string) 用户账号
 * 可选输入，可以不传：
 * --info.user_key (string) 用户密码
 *   info.user_name (string) 用户名字
 *   info.user_photo (string) 用户头像
 * 
 * return: 
 * --result.user_id: 用户账号
 *   result.user_name: 用户名
 *   redult.user_photo
 * --false: 系统bug
 * --400: 用户不存在，约等于系统bug
 */
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
        if (status == 400)
        {
            /**
             * 用户不存在
             * code:402
             */
            console.log(400);
            result = 400;
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

/**
 * 用户登录与登出
 * 直接根据key的存在与否判断是登录还是登出
 * 
 * 输入: 
 * --info.user_id (string) 用户账号
 *   info.user_key (string) 用户密码 ————仅在登录时传入key
 * 输出：
 * --result.user_id: 用户账号
 *   result.user_name: 用户名
 *   result.online: 用户登录状态码
 * --400 用户不存在，约等于系统bug
 * --401 登录密码错误
 * --403 用户online不对，登录已登录账号，或登出未登录账号
 */
const logUser = async function(info) {
    result = false;   

    await axios.post(
        'https://afusuj.toutiao15.com/logUser',
        {    
            id: info.user_id,
            key: info.user_key,
        }
    ).then(function(response){
        let status = response.data;
        if (status == 400)
        {
            /**
             * 用户名不存在
             * code:400
             */
            console.log(400);
            result = 400;
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

/**
 * 查找对应id的用户，查找是正则模糊查找
 * 
 * 输入：
 * --info.user_id 当前用户的id
 * 
 * 输出：
 * --result.user_id
 *   result.user_name
 *   result.user_photo
 *   result.online
 * --401 没有查找到用户
 */

const searchUser = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchUser',
        {    
            id: info.user_id,
        }
    ).then(function(response){
        status = response.data;
        if (status[0] == null)
        {
            /**
             * 找不到用户
             */
            result = 401;
        }
        else
        {
            /**
             * 返回结果
             */        
            result = status;
        }
    })

    console.log(result);
    return result;
}

/**
 * params:
 * --info.user_id
 *   info.user_key
 * return:
 * --400 user not exist
 * --200 right key
 * --401 wrong key
 */
const checkKey = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/checkKey',
        {    
            id: info.user_id,
            key: info.user_key,
        }
    ).then(function(response){
        status = response.data;
        result = status;

        console.log(result);
    })
    return result;
}

exports.searchUser = searchUser;
exports.logUser = logUser;
exports.updUser = updUser;
exports.insertUser = insertUser;
exports.checkKey = checkKey;
