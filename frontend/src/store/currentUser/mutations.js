export default {
    /**
    * @param { object } state
    * @param { string } data
    */
    //设置当前用户信息
    setUser(state,user){
        state.id = user.id;
        state.nickname = user.nickname;
        state.avatar = user.avatar;
    },
    //设置当期用户昵称
    setNickname(state,nickname){
        state.nickname = nickname;
    },
    //设置当前用户头像
    setAvatar(state,avatar){
        state.avatar = avatar;
    }
};
