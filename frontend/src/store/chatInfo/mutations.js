import Vue from 'vue';
export default {
    /**
    * @param { object } state
    * @param { string } data
    */
    // //设置聊天信息
    // setChatInfo(state, info) {
    //     state.chatMessages = info;
    // },
    //增加聊天信息
    addChatInfo(state,info){
        for (let key in info){
            // state.chatMessages[key] = info[key];
            Vue.set(state.chatMessages,key,info[key]);
        }
    },
    //发送消息后更新
    sendUpdate(state,info){
        state.chatMessages[info.id].push(info.message);
    },
    //将好友发送消息修改为已读
    readFriendUpdate(state,id){
        for(let i=0; i<state.chatMessages[id].length;i++){
            if(state.chatMessages[id][i].isFriend === true)
                Vue.set(state.chatMessages[id][i],"isRead",true);
        }
    },
    //将自己发送消息修改为已读
    readMeUpdate(state,id){
        for(let i=0; i<state.chatMessages[id].length;i++){
            if(state.chatMessages[id][i].isFriend === false)
                Vue.set(state.chatMessages[id][i],"isRead",true);
        }
    }
};
