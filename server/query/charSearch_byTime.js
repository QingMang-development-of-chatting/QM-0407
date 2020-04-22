/**
 * 查询聊天记录
 * 每查一次显示六分钟(随便改啦)
 * info.id (string) 用户名
 * info.date (Date.getTime) 时间
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
