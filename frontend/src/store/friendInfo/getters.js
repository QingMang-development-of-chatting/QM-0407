export default{
    //由好友id获取好友资料
    getFriend:function(state){
        return function (id) {
            return state.friendInfoDic[id];
            }
    },
    //获取未读消息数
    getNewInfoNum:function (state) {
        let num = 0;
        for(let key in state.friendInfoDic){
            if (state.friendInfoDic[key].newInfo === true)
                num += state.friendInfoDic[key].unread_num;
        }
        return num;
    }
};
