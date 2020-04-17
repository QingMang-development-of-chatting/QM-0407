//Module Dependencies
const login = require('../query/userLogin.js');
const logout = require('../query/userLogout.js');
const insertUser = require('../query/userInsert.js');

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
UserService.register = function (username, password, nickname) {
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
 * @param {String} username
 * @param {String} password
 * @return {Boolean}
 */
UserService.login = function (username, password) {
	var status = login(username,password);	//TODO为什么是undefined？
	if(status!=400&&status!=388){
		return true;
	}
	else{
		return false;
	}

};

/**
 * logout
 * 
 * @param {String} username
 * @param {String} password
 * @return {Boolean}
 */
UserService.logout = function (username, password) {
	var status = logout(username,password);
	if(status!=0&&status!=-1){
		return true;
	}
	else{
		return false;
	}

};

module.exports = UserService;