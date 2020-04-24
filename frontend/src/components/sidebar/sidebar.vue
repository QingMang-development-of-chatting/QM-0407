<template>
    <div class="sidebar">
        <el-avatar id="avatar" title="修改资料" shape="square" :size="60" fit="cover" :src="avatarUrl"  @click.native="showInfo" ></el-avatar>
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
            avatarUrl:String,
        },
        data(){
            return {
                chatSelect: true,
                friendSelect: false,
                // url: "url",
            }
        },
        methods:{
            showChat(){
                this.chatSelect = true;
                this.friendSelect = false;
                this.$emit('showChat');
            },
            showFriend(){
                this.chatSelect = false;
                this.friendSelect = true;
                this.$emit('showFriend');
            },
            showInfo(){
                this.chatSelect = false;
                this.friendSelect = false;
                this.$emit('showInfo');
            },
            logout(){
                this.$emit('logout');
                // this.$axios.get("/logout").then(()=>{
                //     console.log("已注销");
                //     sessionStorage.removeItem("username");
                //     window.location.href="login";
                // }).catch((error)=>{
                //     console.log(error.response);
                // })
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
        margin-top: 430px;
    }
</style>
