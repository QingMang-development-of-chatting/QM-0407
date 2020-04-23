//Module Dependencies
const login = require('../query/userLogin.js');
const logout = require('../query/userLogout.js');
const insertUser = require('../query/userRegister.js');

//API
const UserService = {};

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

//username合法性检测
const checkUsername = function(username){
	//TODO位数限制
	//TODO特殊字符限制
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
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Boolean}
 */
UserService.register = async function (username, password, nickname) {
	//TODO合法性检测
	if(!(checkUsername(username)&&checkPassword(password)&&checkNickname(nickname))){
		return false;
	}
	//在DB注册用户
	var result = await insertUser({"id":username,"key":password,"name":nickname});
	if(result){	//这里因为query的返回类型不仅仅是bool，所以得判断一下
		return result;
	}
	else{
		return false;
	}
	 
};

/**
 * login
 * 
 * @param {String} username
 * @param {String} password
 */
UserService.login = async function (username, password) {
	
	var status = await login({"id":username,"key":password});	
	if(status!=400&&status!=403){
		return status;
	}
	return false;
};

/**
 * logout
 * 
 * @param {String} username
 * @param {String} password
 * @return {Boolean}
 */
UserService.logout = async function (username, password) {
	var status = await logout({"id":username,"key":password});
	if(status!=400&&status!=403){
		return status;
	}
	return false;
};

module.exports = UserService;
