/*
 * Mocing service-database processing
 */
//施工中。。。等待DB和测试

/**
 * delay for MS ms
 * pretend to query the cloud DB.
 *
 * @param {Number} ms
 */
const timeout = function(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	})
};

/**
 * username exist?
 * @param {String} username
 * @return {Boolean}
 */
const isDuplicateUser = function(username) {
	axios.post(
		'https:......',//url,"查找某个用户"的云函数的网址
		{	//发送的post格式，key值根据云函数修改
			name:username
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
/**
 * user insert
 */
const insertUser = function(username, password,nickname) {
	axios.post(
		'https:......',//url,"插入某个用户于DB"的云函数的网址
		{	//发送的post格式，key值根据云函数修改
			name:username,
			pd:password,
			nn:nickname
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

/**
 *检测用户名和密码
 */
const authenticate = function(username, password) {
	axios.post(
		'https:......',//url,"检测用户名和密码的云函数的网址
		{	//发送的post格式，key值根据云函数修改
			name:username,
			pd:password
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
}

//username有效性检测
const checkUsername = function(username){
	return true;
}
//password有效性检测
const checkPassword = function(pd){
	return true;
}
//nickname有效性检测
const checkNickname = function(nickname){
	return true;
}

/**
 * API
 */
const Service = {};

/**
 * register
 * 
 * static method
 * 
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Boolean}
 */
Service.register = function (username, password, nickname) {
	//检验重复
	if (isDuplicateUser(username)) return false;
	//合法性检测
	if(!(checkUsername(username)&&checkPassword(password)&&checkNickname(nickname))){
		return false;
	}
	//在DB注册用户
	return insertUser(username,password,nickname);
};

/**
 * login
 * 
 * static method
 * 
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Boolean}
 */
Service.login = function (username, password) {
	return authenticate(username, password)
};

module.exports = Service;