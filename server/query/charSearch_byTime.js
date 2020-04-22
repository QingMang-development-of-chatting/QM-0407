/**
 * 查询聊天记录
 * 每查一次显示六分钟(随便改啦)
 * 
 * 输入：
 * --info.id (string) 用户账号
 *   info.date (Date.getTime) 时间
 * 输出：
 * --0：没有查到记录
 * --[{host_id:"id", chat:"chat", data:"Date.getTime"}...]
 *   result[i].host_id 用户ID
 *   result[i].chat 信息
 *   result[i].date 需要转换回去的自1970年1月1日以来的毫秒数
 */
const axios = require('axios');
const searchChat_time = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchChat',
        {    
            host: info.id,
            date: info.date,
        }
    ).then(function(response){
        status = response.data;
        console.log(status);

        if (status[0].host_id == null)
        {
            /**
             * 一条都么有读到记录
             */
            result = 0;
        }   
        else
        {
            /**
             * 返回记录
             * promise格式：
             * [{host_id:"id", chat:"chat", data:"Date.getTime"}...]
             */
            result = status;
        }
    })

    return result;
}

module.export = searchChat_time;
