//Module Dependencies
const searchUser = require('../query2.0/searchUser.js');
const updUser = require('../query2.0/updUser.js');

//API
const UserInfoService = {};

/**
 * 获取多个账号的信息
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
 * update昵称(user_name)
 * @param   {String}     user_id
 * @param   {String}     user_name
 * @return  {Boolean}    result
 */
UserInfoService.updateName= async function (user_id, user_name) {
	var result = await updUser({"user_id":user_id,"user_name":user_name});
	if(result!=402&&result!=false){
		return true;
	}
	return false;
};

/**
 * update头像
 * @param   {String}     user_id
 * @param   {String?}     user_photo
 * @return  {Boolean}    result
 */
UserInfoService.updatePhoto= async function (user_id, user_photo) {
	var result = await updUser({"user_id":user_id,"user_photo":user_photo});
	if(result!=402&&result!=false){
		return true;
	}
	return false;
};

module.exports = UserInfoService;
//UserInfoService.getInfoByArray(["0080","test2","0090"]);
//UserInfoService.updateName("0080",1234);