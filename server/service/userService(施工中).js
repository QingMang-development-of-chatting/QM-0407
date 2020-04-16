//Module Dependencies
const user_query = require('../query/......');

//API
const userService = {};

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
 * 
 * @param {String} username
 * @return {Boolean}
 */
const isDuplicateUser = function(username) {

};
/**
 * user insert
 */
const insertUser = function(username, password,nickname) {

};

/**
 *检测用户名和密码
 */
const authenticate = function(username, password) {
	
}

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
 * static method
 * 
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Boolean}
 */
userService.register = function (username, password, nickname) {
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
userService.login = function (username, password) {
	return authenticate(username, password)
};

module.exports = userService;