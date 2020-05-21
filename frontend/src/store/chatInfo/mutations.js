import Vue from 'vue';
export default {
    /**
    * @param { object } state
    * @param { string } data
    */
    //设置聊天信息
    setChatInfo(state, info) {
        state.chatMessages = info;
    },
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
    }
};
