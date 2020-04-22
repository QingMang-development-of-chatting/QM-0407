<template>
    <div class="chatbar">
        <el-input  placeholder="请输入好友姓名" v-model="input" clearable suffix-icon="el-icon-search"></el-input>
        <el-menu class="chatbar-main">
            <el-menu-item class="chatList" v-for="friend in chatList" :key="friend.index" @click="showChat(friend.id,friend.nickname,friend.time,friend.chatInfo,friend.avatar)">
                <el-avatar class="avatar" shape="square" :size="58" fit="cover" :src="friend.avatar"></el-avatar>
                <span class="nickname">{{friend.nickname}}</span>
                <span class="time">{{friend.time}}</span>
                <span class="chatInfo">{{friend.chatInfo}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        props: {
            chatList:Array
        },
        data(){
            return{
                input: "",
            }
        },
        methods:{
            showChat(id,nickname,time,chatInfo,avatar){
                this.$emit('showChat',id,nickname,time,chatInfo,avatar)
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
