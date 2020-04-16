/**
 * 用户登录
 * 输入账号和密码→数据库查询账号密码是否存在→跳转登录(3)
 * 数据库返回user(obj)
 * get: id & key
 * return: error code / name
 */

const login = function(info) {
	axios.post(
	'https://afusuj.toutiao15.com/login', 
	{	
            id: info.id,
            key: info.key,
	}
	).then(function(response){
	let status = response.data;	    
        if (status == 0)
        {
	    /**
	     * 云端错误码0，账号与密码不存在或不匹配
	     * 返回错误码400
	     */
            console.log(0);
            return 400;
        }
        else if (status == -1)
        {
	    /**
	     * 云端错误码-1，账号已登录，不能重登录
	     * 返回错误码388
	     */
            console.log(-1);
            return -1;
        }
        else
        {
	    /**
	     * 正常登录
	     * 返回账号昵称，正确码&其他信息待添加
	     */
            console.log(status);
            return status;
        }
	})
};

