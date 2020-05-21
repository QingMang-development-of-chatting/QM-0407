import Vue from 'vue';

export default {
    /**
    * @param { object } state
    * @param { string } data
    */
    //增加好友信息
    addFriendInfo(state,info){
        for (let key in info) {
            // state.friendInfoDic[key] = info[key];
            Vue.set(state.friendInfoDic,key,info[key]);
        }
    },
    //设置好友信息
    setFriendInfo(state,info){
        state.friendInfoicDic = info;
    },
};
