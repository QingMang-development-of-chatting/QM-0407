/**
 * 好友申请
 * 干脆写在一个页面了
 * 4个函数 askFriend askHost answerFriend answerHost
 * 
 * 调用方法：
 * var f = require("./addFriend.js");
 * f.askFriend(..)
 * f.askHost(..)
 * f.answerFriend(..)
 * f.answerHost(..)
 * 
 *状态码：
 * 300 申请好友
 * 301 申请通过
 * 302 申请不通过
 * 303 id匹配出错
 * 304 其他错误
 * 305 无待处理好友申请
 */

const axios = require('axios');

/**
 * askFriend 返回当前用户待处理的所有好友请求
 * 调用者：好友申请接受着
 * 输入：
 * --info.host_id 当前用户id
 * --305 无待处理
 * 输出：
 * --<array>JSON
 *   result[].host_id 当前用户id
 *   result[].friend  
 */
const askFriend = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/askFriend',
        {    
            host_id: info.host_id,
        }
    ).then(function(response){
        status = response.data;

        if (status[0] == null)
        {
            /**
             * 没有待处理请求
             */
            console.log(305);
            result = 305;
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


/**
 * askHost 向好友发送好友申请
 * 调用者：好友申请发送者
 * 输入：
 * --info.host_id 当前用户id
 *   info.friend_id
 * 输出：
 * --303 已有请求
 * --300 发送成功
 */
const askHost = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/askHost',
        {    
            host_id: info.host_id,
            friend_id: info.friend_id,
        }
    ).then(function(response){
        status = response.data;

        if (status == 300)
        {
            console.log(300);
            result = 300;
        }
        else if (status == 303)
        {
            console.log(303);
            result = 303;
        }
    })

    return result;
}

/**
 * answerFriend 处理好友申请
 * 调用者：好友申请接受者
 * 输入：
 * --info.host_id 当前用户id
 *   info.friend_id
 *   info.answer 301同意/302不同意
 * 输出：
 * --result.friend_id 处理的好友的id
 *   result.answer 处理码
 * --303 申请不存在/不止一条待处理/已处理
 * --304 bug
 */
const answerFriend = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/answerFriend',
        {    
            host_id: info.host_id,
            friend_id: info.friend_id,
            answer: info.answer,
        }
    ).then(function(response){
        status = response.data;

        if (status == 303 || status == 304)
        {
            console.log("303");
            result = status;
        }
        else
        {
            console.log(200);
            console.log(status);
            result = status;
        }
    })

    return result;
}

/**
 * answerHost 申请人处理
 * 调用者：好友申请发送者
 * 输入：
 * --info.host_id 当前用户id
 * 输出：
 * --<array>JSON
 *   result[].host_id 当前用户id
 *   result[].friend_id 
 *   result[].answer 301同意/302不同意
 * --305 没有待处理请求
 */
const answerHost = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/answerHost',
        {    
            host_id: info.host_id,
        }
    ).then(function(response){
        status = response.data;

        if (status[0] == null)
        {
            console.log(305);
            result = 305;
        }
        else
        {
            /**
             * 返回结果
             */
            console.log(status);
            result = status;
        }
    })

    return result;
}

exports.askFriend = askFriend;
exports.askHost = askHost;
exports.answerFriend = answerFriend;
exports.answerHost = answerHost;
