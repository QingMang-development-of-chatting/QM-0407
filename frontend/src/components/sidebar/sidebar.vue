//侧边栏组件
<template>
    <div class="sidebar">
        <el-avatar id="avatar" title="修改资料" shape="square" :size="60" fit="cover" v-loading="loadingAvatar" :src="avatarUrl"  @click.native="showInfo" ></el-avatar>
        <br/>
        <el-link id="chat" v-bind:class="{selected:chatSelect}" title="聊天" :underline="false"  icon="el-icon-chat-line-round" @click="showChat"></el-link>
        <br/>
        <el-link id="friend" v-bind:class="{selected:friendSelect}" title="通讯录" :underline="false"  icon="el-icon-user-solid" @click="showFriend"></el-link>
        <br/>
        <el-link id="logout" title="退出" :underline="false" class="el-icon-switch-button"  @click="logout"></el-link>
    </div>
</template>

<script>
    export default {
        name:"sidebar",
        props: {
            avatarUrl:String,   //当前用户头像url
            loadingAvatar:Boolean,  //加载头像中
        },
        data(){
            return {
                chatSelect: true,   //是否选中聊天图标
                friendSelect: false,    //是否选中好友图标
            }
        },
        methods:{
            //展示聊天侧边栏
            showChat(){
                this.chatSelect = true;
                this.friendSelect = false;
                this.$emit('showChat'); //触发父组件showChat事件
            },
            //展示好友资料侧边栏
            showFriend(){
                this.chatSelect = false;
                this.friendSelect = true;
                this.$emit('showFriend');   //触发父组件showFriend事件
            },
            //展示个人资料设置
            showInfo(){
                this.chatSelect = false;
                this.friendSelect = false;
                this.$emit('showInfo'); //触发父组件showInfo事件
            },
            //注销
            logout(){
                this.$emit('logout');                //触发父组件logout事件
            }
        },
    };
</script>
<style  lang="css" scoped>
    .sidebar{
        background-color:#6b95554a ;
        height: inherit;
    }
    #chat,#friend,#logout{
        font-size: 48px;
        font-weight: bold;
    }
    #chat:hover,#friend:hover{
        color: #606266;
     }
    .selected{
        color: #7eea52ed !important;
    }
    #logout:hover{
        color:red;
    }
    #avatar{
        position: relative;
        top:20px;
        cursor: pointer;
    }
    #chat,#friend{
        margin-top:30px;
    }
    #logout{
        margin-top: 400px;
    }
</style>
