/**
 * 用户注册
 * 用户输入账号密码→数据库检测账号密码是否已存在(unique)→不存在则插入账号信息(insert)→页面跳转
 * get: info{id, key, name}
 * return: 
 */
const insertUser = function(info) {
	axios.post(
		'https://afusuj.toutiao15.com/ifUserUnique', 
		{	
      id: info.id,
			key: info.key,
			name: info.name,
		}
	).then(function(response){
		let status = response.data;	 
		console.log("response:" + status);
		if (status == -1)
		{
			console.log("error:" + status);
			return false;
		}
		else
		{
    	console.log("insert id:" + status.result.user_id);
			return true;
		}
	})
}
