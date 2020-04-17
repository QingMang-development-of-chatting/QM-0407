/**
 * 用户登出
 * 和登录一模一样的冗余代码
 * 待改
 */
const logout = async function(info) {
    await axios.post(
        'https://afusuj.toutiao15.com/logout',
        {    
            id: info.id,
            key: info.key,
        }
    ).then(function(response){
        let status = response.data;
        if (status == 0)
        {
            /**
             * 用户名或密码错误
             * code:400
             */
            console.log(400);
            return 400;
        }
        else if (status == -1)
        {
             /**
             * 用户未登录
             * code:403
             */
            console.log(403);
            return 403;
        }
        else
        {
            /**
             * 登出成功
             * code:200
             */
            console.log(status + " 200");
            return status;
        }
    })
};

//module.exports = logout;
