/**
 * Expose `Port` (default: 3000)
 */
const PORT = module.exports.PORT = process.env.PORT || 3000;

/**
 * Expose `HTTP`
 */
const HTTP = module.exports.HTTP = {};
HTTP.V1 = {};
HTTP.V1.USER = {};
HTTP.V1.USER.REGISTER = '/v1/user/register/';
HTTP.V1.USERINFO = {};
HTTP.V1.USERINFO.GET_INFO = '/v1/userinfo/:username'
HTTP.V1.USERINFO.SET_PASSWORD = '/v1/userinfo/:username/password';
HTTP.V1.USERINFO.SET_NICKNAME = '/v1/userinfo/:username/nickname';
HTTP.V1.USERINFO.SET_PHOTO = '/v1/userinfo/:username/photo';
HTTP.V1.FRIEND = {};
HTTP.V1.FRIEND.GET_FRIENDS = '/v1/friend/:username';
HTTP.V1.FRIEND.GET_APPLICANTS = '/v1/friend/:username/applicants';
HTTP.V1.FRIEND.REJECT_APPLICANT = '/v1/friend/:username/applicants/reject/:applicant';
HTTP.V1.CHAT = {};
HTTP.V1.CHAT.GET_CHATLIST = '/v1/chat/:username/chatlist';
HTTP.V1.CHAT.GET_HISTORY = '/v1/chat/:username/history/:friend/:time';

/**
 * Expose `Event`
 */
const EVENT = module.exports.EVENT = {};
EVENT.USER = {};
EVENT.USER.LOGIN = 'userLogin';
EVENT.USER.LOGOUT = 'userLogout';
EVENT.FRIEND = {};
EVENT.FRIEND.SEND_APPLY = 'friendApplySend';
EVENT.FRIEND.RECE_APPLY = 'friendApplyRece';
EVENT.FRIEND.SEND_ACCESS = 'friendAccessSend';
EVENT.FRIEND.RECE_ACCESSED = 'friendAccessdRece';
EVENT.FRIEND.SEND_DELETE ='friendDeleteSend';
EVENT.FRIEND.RECE_DELETED ='friendDeletedRece';
EVENT.CHAT = {};
EVENT.CHAT.SEND_MESSAGE = 'messageSend';
EVENT.CHAT.RECE_MESSAGE = 'messageRece';
EVENT.CHAT.SEND_READ_MESSAGE = 'messageReadSend';
EVENT.CHAT.RECE_READ_MESSAGE = 'messageReadRece';

/**
 * Expose `Service`
 */
const SERVICE = module.exports.SERVICE = {};
SERVICE.STATUS = {};
SERVICE.STATUS.BAD_PARAM = 0;
SERVICE.STATUS.REJECT = 1;
SERVICE.STATUS.OK = 2;
SERVICE.STATUS.NOT_FOUND = 3;

/**
 * Expose `Socket`
 */
const SOCKET = module.exports.SOCKET = {};
SOCKET.STATUS = {};
SOCKET.STATUS.BAD_PARAM = 0;
SOCKET.STATUS.REJECT = 1;
SOCKET.STATUS.OK = 2;

/**
 * Expose `Notification`
 */
const NOTIFICATION = module.exports.NOTIFICATION = {};
NOTIFICATION.TYPE = {};
NOTIFICATION.TYPE.APPLY = 0;
NOTIFICATION.TYPE.ACCESS = 1;
NOTIFICATION.TYPE.REJECT = 2;
NOTIFICATION.TYPE.ACCESSED = 3;
NOTIFICATION.TYPE.DELETED = 4;

/**
 * Expose `REASON`
 */
const REASON = module.exports.REASON = {};
REASON.REGISTER = {};
REASON.REGISTER.USER_DUPLICATE = 0;
REASON.LOGIN = {};
REASON.LOGIN.USER_NOTFOUND = 0;
REASON.LOGIN.PASSWORD_ERROR = 1;
REASON.LOGIN.ALREADY_LOGIN = 2;
REASON.LOGOUT = {};
REASON.LOGOUT.NO_LOGIN = 0;
REASON.LOGOUT.DEVICE_CHANGE = 1;

/**
 * Expose `AXIOS`
 */
const AXIOS = module.exports.AXIOS = {};
AXIOS.HOST = 'http://127.0.0.1';

/**
 * Expose `SIMULATE`
 */
const SIMULATE = module.exports.SIMULATE = {};
SIMULATE.MAX_DELAY = 0;
