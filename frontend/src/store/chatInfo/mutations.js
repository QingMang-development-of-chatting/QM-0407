import Vue from 'vue';
export default {
    /**
    * @param { object } state
    * @param { string } data
    */
    //增加多个用户聊天信息
    addChatInfo(state,info){
        for (let key in info){
            // state.chatMessages[key] = info[key];
            Vue.set(state.chatMessages,key,info[key]);
        }
    },
    //发送消息后更新info{id:~,message:{{message:~, isFriend:~, isRead:~, time:~,utcTime:~,activeRate:~}}}
    sendUpdate(state,info){
        state.chatMessages[info.id].push(info.message);
    },
    //将自己发送消息修改为已读
    readMeUpdate(state,id){
        for(let i=0; i<state.chatMessages[id].length;i++){
            if(state.chatMessages[id][i].isFriend === false)
                Vue.set(state.chatMessages[id][i],"isRead",true);
        }
    },
    //获取单个用户更多聊天历史 info{id:~,history:[]}
    getMoreChatInfo(state,info){
        let a = info.history;
        let b = a.concat(state.chatMessages[info.id]);
        Vue.set(state.chatMessages,info.id,b);
    },
    //删除聊天消息
    deleteChatInfo(state,id){
        Vue.delete(state.chatMessages,id);
    }

};
