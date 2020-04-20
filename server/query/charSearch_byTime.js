/**
 * 查询聊天记录
 * 每查一次显示六分钟(随便改啦)
 * info.id (string) 用户名
 * info.date (Date.getTime) 时间
 */

const searchChat = async function(info) {
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
        { return false; }
        else
        { return status; }
    })
}
