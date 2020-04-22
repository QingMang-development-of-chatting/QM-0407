/**
 * 上传聊天记录
 * 关于时间 会在云端直接计算
 * 后续迭代可以修正post通信的时间差
 * info.id (string) 用户名
 * info.chat (Array["text1", "text2"..]) 聊天内容
 */
const axios = require('axios');
const insertChat = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/insertChat',
        {    
            host: info.id,
            chat: info.chat,
        }
    ).then(function(response){
        status = response.data;
        //console.log("insert " + status + "chatting");
        if (status > 0)
        {
            /**
             * 无法插入数据/插入数据不存在
             */
            rusult = false;
        }
        else
        {
            /**
             * 成功插入记录
             * 返回插入记录条数
             */
            result = status;
        }
    })

    return result;
}

module.export = insertChat;
