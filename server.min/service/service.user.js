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
    //合法性检测
    var un_isvalid = username_validate(username);
    var pw_isvalid = password_validate(password);
    var nn_isvalid = nickname_validate(nickname);
    var is_valid=un_isvalid&&pw_isvalid&&nn_isvalid;
    if (!is_valid) {
        let reason = 0;
        reason = reason | (un_isvalid ? 0 : REASON.REGISTER.USERNAME_ERROR);
		reason = reason | (pw_isvalid ? 0 : REASON.REGISTER.PASSWORD_ERROR);
        reason = reason | (nn_isvalid ? 0 : REASON.REGISTER.NICKNAME_ERROR);
		return { status: STATUS.REJECT, reason: reason };
	}

    //注册用户
	var status = await userFunc.insertUser({"user_id":username,"user_key":password,"user_name":nickname});
	if(status==401){ //id重复，注册失败
		return { status: STATUS.REJECT, reason: REASON.REGISTER.USER_DUPLICATE };
	}
    //注册成功
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
    if(status==400){    //用户不存在
        return { status: STATUS.NOT_FOUND };
    }
    if(status==200){    //用户存在，且密码正确
        return { status: STATUS.OK };
    }
    if(status==401){    //用户存在，但密码错误
        return { status: STATUS.REJECT };
    }
};

/**
 * 根据username、获取用户info
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
    if(result==401||username!=result[0].user_id){ //用户不存在
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
    //合法性检测
    var pw_isvalid = password_validate(password);
    if (!pw_isvalid) {
		return { status: STATUS.REJECT, reason: REASON.USERINFO.PASSWORD_ERROR };
	}
    //query
    var result = await userFunc.updUser({"user_id":username,"user_key":password});
    if(result==400){ //用户不存在
        return { status: STATUS.NOT_FOUND };
    }else{ //修改成功
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
    //合法性检测
    var nn_isvalid = nickname_validate(nickname);
    if (!nn_isvalid) {
		return { status: STATUS.REJECT, reason: REASON.USERINFO.NICKNAME_ERROR };
	}
    //query
    var result = await userFunc.updUser({"user_id":username,"user_name":nickname});
    if(result==400){    //用户不存在
        return { status: STATUS.NOT_FOUND };
    }else{  //修改成功
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
	//TODO:validcheck,暂无要求
    //query
    var result = await userFunc.updUser({"user_id":username,"user_photo":photo});
    if(result==400){ //用户不存在
        return { status: STATUS.NOT_FOUND };
    }else{  //修改成功
        return { status: STATUS.OK };
    }
};

/**
 * 各类合法性检测
 * @api private
 */
function username_validate(name){
    //      /^[a-zA-Z0-9_-]{3,15}$/ 
    var result = name.search(/^[a-zA-Z0-9_-]{3,15}$/i);
    if(result!=-1){ //合法
        return true;
    }
    return false;
}
function password_validate(pw){
    //长度限制  8~16
    var len = pw.length;
    if(len>=8&&len<=16){
        return true;
    }
    return false;
}

function nickname_validate(nickname){
    //长度限制  10  ,且不为空
    var len = nickname.length;
    if(len!=0&&len<=10){
        return true;
    }
    return false;
}



/**
 * Expose `Service`
 */
module.exports = Service;


//test
//Service.prototype.register("t@","test","");
//Service.prototype.isValid('test_user', 'test_password');
//Service.prototype.setPassword('test_user', 'test_password');
// Service.prototype.setNickname("t","123");
// Service.prototype.setPhoto("t","photo");
//Service.prototype.login("t","tttt");
//Service.prototype.logout("t");