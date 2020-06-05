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

// /**
//  * username、password的有效性检测
//  *
//  * Examples:
//  *
//  *   service.isValid('Steve Jobs', 'Apple');
//  *
//  * @param {String} username
//  * @param {String} password
//  * @return {Object{status}} for result
//  * @api public
//  */
// Service.prototype.isValid = async function(username, password) {
// 	// TODO: query
// 	// 这里芊愉没有支持，不过给的query的login也可以曲折实现；或者叫芊愉改一下

// 	// TODO: case: no such user
// 	return { status: STATUS.NOT_FOUND };
	
// 	// TODO: case: right password
// 	return { status: STATUS.OK };

// 	// TODO: case: error password
// 	return { status: STATUS.REJECT };
// };

// /**
//  * 获取用户info，精确搜索username
//  *
//  * Examples:
//  *
//  *   service.getInfo('Steve Jobs');
//  *
//  * @param {String} username
//  * @return {Object{status, data}} for result
//  * @api public
//  */
// Service.prototype.getInfo = async function(username) {
//     //query
//     var status = await userFunc.searchUser({"user_id":username});
//     //case:用户不存在
//     var isexist =false ;
//     if(status!=401){
//         for(i = 0;i<status.length;i++){
//             if(username==status[i]){
//                 isexist()
//             }
//         }
//     }
    
//     if(! username in status){
//         console.log("用户不存在");
//         return { status: STATUS.NOT_FOUND };
//     }
//     if(isexist)
//     var a = 1;

// 	// TODO: case: succeed
// 	// TODO: convert query result to {username(String), nickname(String), photo(String)}
// 	// TODO: expect `photo` to be '' if not set
// 	// return { status: STATUS.OK, data: ... };
// };

// /**
//  * 获取用户info，模糊搜索username
//  *
//  * Examples:
//  *
//  *   service.getInfo('Steve Jobs');
//  *
//  * @param {String} username
//  * @return {Object{status, data}} for result
//  * @api public
//  */
// Service.prototype.getInfos_fuzzy = async function(username) {
//     //query
//     var status = await userFunc.searchUser({"user_id":username});
//     //case:用户不存在
//     var isexist =false ;
//     // if(status!=401){
//     //     for(i = 0;i<status.length;i++){
//     //         if(username==status[i]){
//     //             isexist=true;
//     //         }
//     //     }
//     // }
    
//     if(! username in status){
//         console.log("用户不存在");
//         return { status: STATUS.NOT_FOUND };
//     }
//     if(isexist)
//     var a = 1;

// 	// TODO: case: succeed
// 	// TODO: convert query result to {username(String), nickname(String), photo(String)}
// 	// TODO: expect `photo` to be '' if not set
// 	// return { status: STATUS.OK, data: ... };
// };

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
//Service.prototype.getInfo("test");
//Service.prototype.setPassword("t","tttt");
// Service.prototype.setNickname("t","123");
// Service.prototype.setPhoto("t","photo");