
const insertUser = function() {
	axios.post(
		'https://afusuj.toutiao15.com/insertUser',//url,"插入某个用户于DB"的云函数的网址
		{	//发送的post格式，key值根据云函数修改
			// user_id:username,
			// user_key:password,
            // user_name:nickname
            id:"test2",
			key:"test",
			name:"test"
		}
	).then(function(response){
		let status = res.data.sta;	//sta为response的key值，根据云函数修改
		switch(status){
            case "success": 
            return true;

            case "fail": 
            return false;

            default:
			return false;
        }
	})
 	return false;
};
insertUser();

