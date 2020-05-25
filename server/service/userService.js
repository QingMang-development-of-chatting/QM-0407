//Module Dependencies
const logUser = require('../query2.0/logUser.js');
const insertUser = require('../query2.0/insertUser.js');

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
	var status = await insertUser({"user_id":user_id,"user_key":user_key,"user_name":user_name});
	if(status!=400){
		return true;
	}
	return status;
};

/**
 * login
 * 
 * @param {String} user_id		账号
 * @param {String} user_key		密码
 */
UserService.login = async function (user_id, user_key) {
	var status = await logUser({"id":user_id,"key":user_key});	
	if(status!=401&&status!=402&&status!=403){
		return true;
	}
	return status;
};

/**
 * logout
 * @param {String} user_id		账号
 * @return {Boolean}
 */
UserService.logout = async function (user_id) {
	var status = await logUser({"id":user_id});
	if(status!=402&&status!=403){
		return true;
	}
	return status;
};

module.exports = UserService;
//UserService.register("test_user","test_key","test_name");
//UserService.login("test_user","test_key");
//UserService.logout("test_user");
