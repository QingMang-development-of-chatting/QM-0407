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
    //修改最近聊天信息info:[{id:~,newInfo:~,unread_num:~,message:~,time:~},...]
    addRecent(state,info){
        for (let i=0;i<info.length;i++)
        {
            Vue.set(state.friendInfoDic[info[i].id],'newInfo' , info[i].newInfo);
            Vue.set(state.friendInfoDic[info[i].id], 'unread_num' , info[i].unread_num);
            Vue.set(state.friendInfoDic[info[i].id],'recentMessage' ,{message:info[i].message,time:info[i].time});
        }
    },
    //去除新消息提醒
    removeNew(state,id){
        Vue.set(state.friendInfoDic[id],'newInfo',false);
        Vue.set(state.friendInfoDic[id],'unread_num',0);
    },
};
