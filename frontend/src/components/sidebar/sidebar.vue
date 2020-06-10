//侧边栏组件
<template>
    <div class="sidebar">
        <el-avatar id="avatar" title="修改资料" shape="square" :size="60" fit="cover" v-loading="loadingAvatar" :src="avatarUrl"  @click.native="showInfo" ></el-avatar>
        <br/>
        <el-badge class="chatBadge" :value="unreadMessageNum" :hidden="unreadMessageNum<1">
            <el-link id="chat" v-bind:class="{selected:chatSelect}" title="聊天" :underline="false"  icon="el-icon-chat-line-round" @click="showChat"></el-link>
        </el-badge>
        <br/>
        <el-badge :is-dot="getNewFriend" >
            <el-link id="friend" v-bind:class="{selected:friendSelect}" title="通讯录" :underline="false"  icon="el-icon-user-solid" @click="showFriend"></el-link>
        </el-badge>
        <br/>
        <el-link id="wordCloud" v-bind:class="{selected:wordCloudSelect}" title="词云" :underline="false"  icon="el-icon-cloudy" @click="showWordCloud"></el-link>
        <el-link id="logout" title="退出" :underline="false" class="el-icon-switch-button"  @click="logout"></el-link>

    </div>
</template>

<script>
    export default {
        name:"sidebar",
        props: {
            avatarUrl:String,   //当前用户头像url
            loadingAvatar:Boolean,  //加载头像中
            getNewFriend:Boolean,   //是否有好友申请未处理
            unreadMessageNum:Number,  //未读信息数
        },
        data(){
            return {
                chatSelect: true,   //是否选中聊天图标
                friendSelect: false,    //是否选中好友图标
                wordCloudSelect:false,  //是否选中词云图标
            }
        },
        methods:{
            //展示聊天侧边栏
            showChat(){
                this.friendSelect = false;
                this.wordCloudSelect = false;
                this.chatSelect = true;
                this.$emit('showChat'); //触发父组件showChat事件
            },
            //展示好友资料侧边栏
            showFriend(){
                this.chatSelect = false;
                this.wordCloudSelect = false;
                this.friendSelect = true;
                this.$emit('showFriend');   //触发父组件showFriend事件
            },
            //展示个人资料设置
            showInfo(){
                // this.chatSelect = false;
                // this.friendSelect = false;
                this.$emit('showInfo'); //触发父组件showInfo事件
            },
            //显示词云图
            showWordCloud(){
                this.chatSelect = false;
                this.friendSelect = false;
                this.wordCloudSelect = true;
                this.$emit('showWordCloud');    //触发父组件showWordCloud事件
            },
            //注销
            logout(){
                this.$emit('logout');   //触发父组件logout事件
            },

        },
    };
</script>
<style  lang="css" scoped>
    .sidebar{
        background-color:#6b95554a ;
        height: inherit;
    }
    #chat,#friend,#logout,#wordCloud{
        font-size: 48px;
        font-weight: bold;
    }
    #chat:hover,#friend:hover,#wordCloud:hover{
        color: #606266;
     }
    .selected{
        color: #7eea52ed !important;
    }
    #logout:hover{
        color:red;
    }
    #avatar{
        /*position: relative;*/
        margin-top:20px;
        cursor: pointer;
    }

    #chat,#friend,#wordCloud{
        margin-top: 30px ;
    }
    #logout{
        margin-top: 300px ;
    }
    .el-badge >>>  .el-badge__content{
        right: 15px;
        top: 40px;
        background-color: #f51500;
        height: 12px;
        width: 12px;
    }
    .chatBadge >>>  .el-badge__content{
        height: unset;
        width: unset;
    }

</style>
