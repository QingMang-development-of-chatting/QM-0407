/**
 * 查询聊天记录
 * 每查一次显示六分钟(随便改啦)
 * info.id (string) 用户名
 * info.key (string) 关键字
 */

const searchChat = async function(info) {
    await axios.post(
        'https://afusuj.toutiao15.com/searchChat_byNum',
        {    
            host: info.id,
            key: info.key,
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
