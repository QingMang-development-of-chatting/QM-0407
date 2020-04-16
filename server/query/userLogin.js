/**
 * 用户登录
 * 输入账号和密码→数据库查询账号密码是否存在→跳转登录(3)
 * 数据库返回user(obj)
 * get: id & key
 * return: users_(boolean)
 */

const login = function(info) {
	axios.post(
		'https://afusuj.toutiao15.com/login',  //url,"插入某个用户于DB"的云函数的网址
		{	
            id: info.id,
            key: info.key,
		}
	).then(function(response){
		let status = response.data;	    //sta为response的key值，根据云函数修改
        if (status == 0)
        {
            console.log(0);
            return 0;
        }
        else if (status == -1)
        {
            console.log(-1);
            return -1;
        }
        else
        {
            console.log(status);
            return status;
        }
	})
};

