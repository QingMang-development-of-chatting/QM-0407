/**
 * Module dependencies
 */
//query
const userFunc = require('../query3.0/userFunc.js');
//constant
const { SERVICE: { STATUS: STATUS }, REASON } = require('../constant');

/**
 * `Service` constructor
 * @api public
 */
function Service() {}

/**
 * 注册
 *
 * Examples:
 *
 *   service.register('Steve Jobs', 'Apple', 'The father of Apple');
 *
 * @param {String} username
 * @param {String} password
 * @param {String} nickname
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.register = async function(username, password, nickname) {
	//valid check

    //注册用户
	var status = await userFunc.insertUser({"user_id":username,"user_key":password,"user_name":nickname});
	if(status==401){
        console.log("id重复，注册失败");
		return { status: STATUS.REJECT, reason: REASON.REGISTER.USER_DUPLICATE };
	}
    console.log("注册成功");
	return { status: STATUS.OK };
};

/**
 * 检测username的用户是否存在，以及password是否对应
 *
 * Examples:
 *
 *   service.isValid('Steve Jobs', 'Apple');
 *
 * @param {String} username
 * @param {String} password
 * @return {Object{status}} for result
 * @api public
 */
Service.prototype.isValid = async function(username, password) {
	//query
    var status = await userFunc.checkKey({"user_id":username,"user_key":password});
    //case:用户不存在
    if(status==400){
        console.log("用户不存在");
        return { status: STATUS.NOT_FOUND };
    }
    if(status==200){
        console.log("用户存在，且密码正确");
        return { status: STATUS.OK };
    }
    if(status==401){
        console.log("用户存在，但密码错误");
        return { status: STATUS.REJECT };
    }
    console.log("其他错误");
};

/**
 * 获取用户info，精确搜索username
 *
 * Examples:
 *
 *   service.getInfo('Steve Jobs');
 *
 * @param {String} username
 * @return {Object{status, data}} for result
 * @api public
 */
Service.prototype.getInfo = async function(username) {
    //query
    var result = await userFunc.searchUser({"user_id":username});
    //case:用户不存在
    if(result==401||username!=result[0].user_id){
        console.log("用户不存在");
        return { status: STATUS.NOT_FOUND };
    }
    //成功找到用户
    var info = result[0];
	// 格式适配     {username(String), nickname(String), photo(String)}
    var data = {username:info.user_id,nickname:info.user_name,photo:info.user_photo};
    if(data.photo=="0"){
        data.photo = '';
    }
	return { status: STATUS.OK, data: data };
};



/**
 * 修改username用户的password
 * Examples:
 *
 *   service.setPassword('Steve Jobs', '114514');
 *
 * @param {String} username
 * @param {String} password
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.setPassword = async function(username, password) {
	//TODO:validcheck
    //query
    var result = await userFunc.updUser({"user_id":username,"user_key":password});
    if(result==400){
        console.log("用户不存在");
        return { status: STATUS.NOT_FOUND };
    }else{
        console.log("修改成功");
        return { status: STATUS.OK };
    }
};

/**
 * 修改username用户的nickname
 * Examples:
 *
 *   service.setNickname('Steve Jobs', 'Apple');
 *
 * @param {String} username
 * @param {String} nickname
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.setNickname = async function(username, nickname) {
	//TODO:validcheck
    //query
    var result = await userFunc.updUser({"user_id":username,"user_name":nickname});
    if(result==400){
        console.log("用户不存在");
        return { status: STATUS.NOT_FOUND };
    }else{
        console.log("修改成功");
        return { status: STATUS.OK };
    }
};

/**
 * 修改username用户的photo
 * Examples:
 *
 *   service.setPhoto('Steve Jobs', 图像的string);
 *
 * @param {String} username
 * @param {String} photo
 * @return {Object{status, reason}} for result
 * @api public
 */
Service.prototype.setPhoto = async function(username, photo) {
	//TODO:validcheck
    //query
    var result = await userFunc.updUser({"user_id":username,"user_photo":photo});
    if(result==400){
        console.log("用户不存在");
        return { status: STATUS.NOT_FOUND };
    }else{
        console.log("修改成功");
        return { status: STATUS.OK };
    }
};



/**
 * Expose `Service`
 */
module.exports = Service;
//Service.prototype.register("t","tp","tt");
Service.prototype.isValid('test_user', 'test_password');
//Service.prototype.setPassword('test_user', 'test_password');
// Service.prototype.setNickname("t","123");
// Service.prototype.setPhoto("t","photo");