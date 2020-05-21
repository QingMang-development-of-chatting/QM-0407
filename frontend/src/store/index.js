import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

//import currentUser 模块
import currentUser from "./currentUser";
import friendInfo from "./friendInfo";
import chatInfo from"./chatInfo";
import applyList from"./applyList";

export default new Vuex.Store({
    // 通过modules属性引入login 模块。
    modules: {
        currentUser: currentUser,   //当前用户信息
        friendInfo: friendInfo, //好友列表信息
        chatInfo:chatInfo,  //好友聊天记录信息
        applyList:applyList,    //好友申请表
    }
})
