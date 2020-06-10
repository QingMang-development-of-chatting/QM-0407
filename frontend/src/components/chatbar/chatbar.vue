//聊天侧边栏组件
<template>
    <div class="chatbar" >
        <el-input  class="searchBar" placeholder="输入好友昵称查找好友" v-model="searchInput" clearable prefix-icon="el-icon-search"></el-input>
        <el-menu class="chatbar-main" v-loading="loadingChatBar">
            <el-menu-item class="chatListClass" v-for="(message,key) in chatLists" :key="key" v-show="search(message.nickname)" @click="toChat(key,message.nickname,message.avatar)">
                <el-badge :value="message.unread_num" :hidden="!message.newInfo || message.unread_num<1">
                    <el-avatar class="avatar" shape="square" :size="58" fit="cover" :src="message.avatar"></el-avatar>
                </el-badge>
                <span class="nickname">{{message.nickname}}</span>
                <span class="time">{{message.recentMessage.time}}</span>
                <span class="chatInfo">{{message.recentMessage.message}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        props: {
            //聊天列表{好友账号id,好友昵称nickname,好友头像avatar,最近一条聊天信息时间time,最近一条聊天信息chatInfo}...
            chatList:Object,
            //是否正在加载聊天列表
            loadingChatBar: Boolean,
        },
        data(){
            return{
                searchInput: "",  //搜索栏输入
            }
        },
        computed:{
            chatLists(){
                let temp={};
                for (let key in this.chatList)
                {
                    if (this.chatList[key].recentMessage.message !== undefined)
                        temp[key] = this.chatList[key];
                }
                //console.log(temp);
                return temp;
            }

        },
        methods:{
            //展示好友对话框
            toChat(id,nickname,avatar){
                this.$emit('toChat',id,nickname,avatar);
            },
            //搜索框筛选匹配
            search(nickname){
                if(this.searchInput !== "") {
                    let t = '/' + this.searchInput +'/';
                    let pattern = eval(t);
                    if (pattern.test(nickname))
                        return true;
                    else
                        return false;
                }
                else
                    return true;
            },
        }
    };
</script>
<style  lang="css" scoped>
    .chatbar{
        background-color: #e6e6e5;
        height: inherit;
        position: absolute;
        width: inherit;
    }
    .avatar{
        position: relative;
        top: 10px;
        left: -5px
    }
    .chatListClass{
        background-color: #e6e6e5;
        text-align: left;
        height: 80px;
        box-sizing: border-box;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03)
    }
    .chatListClass:hover{
        background-color: #d2d2d1;
    }
    .nickname{
        font-size: large;
        position: relative;
        left: 10px;
        color:black;
    }
    .chatInfo{
        font-size: 13px;
        position: absolute;
        top: 30px;
        left: 90px;
        color: #7E7878;
    }
    .time{
        font-size: 13px;
        position: absolute;
        right: 15px;
        color: #7e7878;
    }
    .chatbar>>>.el-input{
        font-size: 15px;
        width:80% ;
        height: 8%;
        box-sizing: border-box;
        padding-top: 12px ;
        padding-bottom: 12px ;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
        position:relative;
        left:-20px;
    }
    .chatbar-main{
        height:92%;
        overflow-y: auto;
    }
    .el-badge >>> .el-badge__content{
        right: 18px;
        top: 15px;
        background-color: #f51601de;
    }
    .searchBar >>> .el-input__inner{
        padding-left: 45px !important;
    }
    .searchBar >>> .el-input__prefix{
        padding-top: 4px;
        padding-left: 10px !important;
    }
</style>
