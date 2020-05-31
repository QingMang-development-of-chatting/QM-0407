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
 * 301 申请通过
 * 302 申请不通过
 */

const axios = require('axios');

/**
 * sendRequest 向好友发送好友申请
 * 调用者：好友申请发送者
 * 输入：
 * --info.host_id 当前用户id
 *   info.friend_id
 * 输出：
 * --300 成功发送
 * --401 已经在好友列表里
 * --402 已经申请过了
 */
const sendRequest = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/askHost',
        {    
            host_id: info.host_id,
            friend_id: info.friend_id,
        }
    ).then(function(response){
        status = response.data;

        console.log(status);
        result = status;
    })

    return result;
}

/**
 * readRequest 返回当前用户待处理的所有好友请求
 * 调用者：好友申请接受着
 * 输入：
 * --info.host_id 当前用户id
 * --305 无待处理
 * 输出：
 * --<array>JSON
 *   result[].host_id 当前用户id
 *   result[].friend  
 */
const readRequest = async function(info) {
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
 * sendAnswer 发送申请同意/不同意信息
 * 一次只能发送一个人的
 * 输入：
 * --info.host_id 当前用户id
 *   info.friend_id
 *   info.answer 301同意/302不同意
 * 输出：
 * --result.friend_id 处理的好友的id
 *   result.answer 处理码
 * --400 系统错误/请求不存在/已经回应
 */
const sendAnswer = async function(info) {
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

        if (status == 400)
        {
            console.log("400");
            result = 400;
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
 * readAnswer 获取申请的处理情况
 * 和readRequest的唯一区别是这个会把非300待处理的请求删除，并且不返回300的数据
 * 即会删除所有已经处理好的数据，不可撤回
 * 如果是friend调用addfriend的话这个函数不一定要调用
 * 主要用处是处理缓存
 * 输入：
 * --info.host_id 当前用户id
 * 输出：
 * --<array>JSON
 *   result[].host_id 当前用户id
 *   result[].friend_id 
 *   result[].answer 301同意/302不同意
 * --305 没有待处理请求
 */
const readAnswer = async function(info) {
    var result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/answerHost',
        {    
            host_id: info.host_id,
        }
    ).then(function(response){
        status = response.data;

        if (status == 305)
        {
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

exports.sendAnswer = sendAnswer;
exports.sendRequest = sendRequest;
exports.readAnswer = readAnswer;
exports.readRequest = readRequest;
