//聊天侧边栏组件
<template>
    <div class="chatbar">
        <el-input  placeholder="请输入好友姓名" v-model="input" clearable suffix-icon="el-icon-search"></el-input>
        <el-menu class="chatbar-main">
            <el-menu-item class="chatList" v-for="(message,key) in chatList" :key="key"  @click="toChat(key,message.nickname,message.avatar)">
                <el-avatar class="avatar" shape="square" :size="58" fit="cover" :src="message.avatar"></el-avatar>
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
            chatList:Object
        },
        data(){
            return{
                input: "",  //搜索栏输入
            }
        },
        methods:{
            //展示好友对话框
            toChat(id,nickname,avatar){
                this.$emit('toChat',id,nickname,avatar);
            }
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
    .chatList{
        background-color: #e6e6e5;
        text-align: left;
        height: 80px;
        box-sizing: border-box;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03)
    }
    .chatList:hover{
        background-color: #d2d2d1;
    }
    .nickname{
        font-size: large;
        position: relative;
        left: 10px;
    }
    .chatInfo{
        font-size: 13px;
        position: absolute;
        top: 30px;
        left: 90px;
        color: #7e7878;
    }
    .time{
        font-size: 13px;
        position: absolute;
        right: 15px;
        color: #7e7878;
    }
    .chatbar>>>.el-input{
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
</style>
