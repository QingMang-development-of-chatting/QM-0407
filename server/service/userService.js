//Module Dependencies
const userFunc = require('../query3.0/userFunc.js');

//API
const UserService = {};

//TODO 各类合法性检测
//username合法性检测
const checkUsername = function(username){
	return true;
}
//password合法性检测
const checkPassword = function(pd){
	return true;
}
//nickname合法性检测
const checkNickname = function(nickname){
	return true;
}

//登录、登出、注册

/**
 * register
 *
 * @param {String} user_id		账号
 * @param {String} user_key		密码
 * @param {String} user_name	昵称
 * @return {Boolean} status
 */
UserService.register = async function (user_id, user_key, user_name) {
	//合法性检测
	if(!(checkUsername(user_id)&&checkPassword(user_key)&&checkNickname(user_name))){
		return false;
	}
	//注册用户
	var status = await userFunc.insertUser({"user_id":user_id,"user_key":user_key,"user_name":user_name});
	if(status==401){
		console.log("id重复，注册失败")
		return false;
	}
	console.log("注册成功")
	return true;
};

/**
 * login	
 * @param {String} user_id		账号
 * @param {String} user_key		密码
 */
UserService.login = async function (user_id, user_key) {
	var status = await userFunc.logUser({"user_id":user_id,"user_key":user_key});	
	if(status!=400&&status!=401&&status!=403){
		console.log("成功登录")
		return true;
	}
	console.log("登录失败");
	return status;
};

/**
 * logout
 * @param {String} user_id		账号
 * @return {Boolean}
 */
UserService.logout = async function (user_id) {
	var status = await userFunc.logUser({"user_id":user_id});
	if(status!=400&&status!=403){
		console.log("成功登出");
		return true;
	}
	console.log("登出失败");
	return status;
};

//获取账号信息、upd信息、upd头像

/**
 * 获取多个资料账号的信息
 * @param   {Array}   user_id_array
 * @return  {Array}   user_info_array
 */
UserService.getInfoByArray= async function (user_id_array) {
	var user_info_array = [];
	for(i = 0,len=user_id_array.length; i < len; i++) {
		var status = await userFunc.searchUser({"user_id":user_id_array[i]});
		if(status==401){	//用户不存在，push null
			user_info_array.push(null);
		}
		else{
			user_info_array.push(status);
		}
	}
	return user_info_array;
};

/**
 * update昵称(user_name)
 * @param   {String}     user_id
 * @param   {String}     user_name
 * @return  {Boolean}    result
 */
UserService.updateName= async function (user_id, user_name) {
	var result = await userFunc.updUser({"user_id":user_id,"user_name":user_name});
	if(result==400){
		console.log("用户不存在");
		return false;
	}
	console.log("更新完毕");
	return true;
};

/**
 * update头像
 * @param   {String}     user_id
 * @param   {String?}     user_photo
 * @return  {Boolean}    result
 */
UserService.updatePhoto= async function (user_id, user_photo) {
	var result = await userFunc.updUser({"user_id":user_id,"user_photo":user_photo});
	if(result==400){
		console.log("用户不存在");
		return false;
	}
	console.log("更新完毕");
	return true;
};


module.exports = UserService;
//UserService.register("test_user1","test_key","test_name");
//UserService.login("test_user1","test_key");
//UserService.logout("test_user1");
//UserService.getInfoByArray(["test_user1","testuser"])
//UserService.updateName("test_user1","tn");
//UserService.updatePhoto("test_user1","photo");
