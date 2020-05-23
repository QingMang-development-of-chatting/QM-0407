//Module Dependencies
const searchUser = require('../query2.0/searchUser.js');

//API
const UserInfoService = {};

/**
 * TODO 获取多个账号的信息
 * @param   {Array}   user_id_array
 * @return  {Array}   user_info_array
 */
UserInfoService.getInfoByArray= async function (user_id_array) {
	var user_info_array = [];
	for(i = 0,len=user_id_array.length; i < len; i++) {
		var status = await searchUser({"user_id":user_id_array[i]});
		user_info_array.push(status);
	}
	return user_info_array;
};

/**
 * TODO update昵称(user_name)
 * @param   {String}     user_id
 * @param   {String}     user_name
 * @return  {Boolean}    result
 */
UserInfoService.updateName= async function (user_id, user_name) {

};

/**
 * TODO update头像
 * @param   {String}     user_id
 * @param   {String}     user_name
 * @return  {Boolean}    result
 */
UserInfoService.updatePhoto= async function (user_id, user_name) {

};

module.exports = UserInfoService;
//UserInfoService.getInfoByArray(["0080","test2","0090"]);