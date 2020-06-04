export default{
    //由好友id获取好友资料
    getFriend:function(state){
        return function (id) {
            return state.friendInfoDic[id];
            }
    }
};
