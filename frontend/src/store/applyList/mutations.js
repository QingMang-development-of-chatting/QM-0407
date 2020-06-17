export default {
    /**
    * @param { object } state
    * @param { string } data
    */
    //设置好友申请信息
    set(state, data) {
        state.data = data;
    },
    //增加好友申请信息
    add(state,info){
        state.data.unshift(info);
    },
    //接受好友申请更新
    accept(state,id){
        for(let index in state.data)
            if(state.data[index].id === id && state.data[index].dispose === 0) {
                state.data[index].dispose = 1;
            }
    },
    //拒绝好友申请更新
    reject(state,info){
        for(let index in state.data)
            if(state.data[index].id === info) {
                state.data[index].dispose = -1;
            }
    }
};
