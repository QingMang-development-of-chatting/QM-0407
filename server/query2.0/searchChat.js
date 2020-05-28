/**
 * 查询聊天记录
 * 每查一次显示六分钟(随便改啦)
 * 
 * 输入：
 * --info.user_id (string) 用户账号
 *   info.room                      ————如果没有↓按照room输出
 *   可选：
 *   info.key (string) 关键字        ————按关键字搜索
 *   info.date (Date.getTime) 时间   ————按时间搜索
 *   info.new 如果=1，则输出一条此room的最新消息
 * 输出：
 * --0：没有查到记录
 * --[{host_id:"id", chat:"chat", data:"Date.getTime"}...]
 *   result[i].host_id 用户ID
 *   result[i].chat 信息
 *   result[i].date 需要转换回去的自1970年1月1日以来的毫秒数
 *   result[i].user_read 已经阅读本消息的人
 * --搜索第一条记录，返回的不是列表，其余同↑
 */

const axios = require('axios');
const searchChat = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchChat',
        {    
            id: info.user_id,
            key: info.key,
            date: info.date,
            room: info.room,
        }
    ).then(function(response){
        status = response.data;
        console.log(status);

        if (status[0] == null)
        {
            /**
             * 一条都么有读到记录
             */
            console.log("code:0");
            result = 0;
        }
        else
        {
            /**
             * 返回记录
             * promise格式：
             * [{host_id:"id", chat:"chat", data:"Date.getTime"}...]
             */
            console.log("code:200");
            result = status;
        }
    })

    return status;
}

module.exports = searchChat;
