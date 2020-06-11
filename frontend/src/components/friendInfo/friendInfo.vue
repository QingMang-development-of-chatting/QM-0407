//好友资料组件
<template>
    <div class="friendWindow">
        <div class="friendArea">
            <div id="friendAvatar">
                头像：<el-avatar  shape="square" :size="100" fit="cover" :src="friendAvatar"></el-avatar>
            </div>
            <div id="friendNickname">
                昵称：<span class="headText">{{friendNickname}}</span>
            </div>
            <div id="friendId">
                账号：{{friendId}}
            </div>
            <el-button id="sendmessage" @click="toChat()">发送消息</el-button>
            <el-button id="delete" @click="deleteFriend()">删除好友</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            friendId:String,    //好友ID
            friendNickname:String,  //好友昵称
            friendAvatar:String,    //好友头像   
        },
        data(){
            return{
            }
        },
        methods:{
            toChat(){
                this.$emit('toChat',this.friendId,this.friendNickname,this.friendAvatar);
            },
            deletefriend(){
                this.$emit('deleteFriend',this.friendId);
            }
            
        }
    };
</script>

<style lang="css" scoped>
    .friendWindow{
        font-size: 20px;
        background: rgba(249, 249, 249, 0.98);
        height: 100%;
        width: 100%;
        position: fixed;
        text-align: left;
        color: black;
        font-family: sans-serif;
    }
    .friendArea{
        background-color: #e8e6e6;
        width: 480px;
        height: 320px;
        position: fixed;
        left:48%;
        top:20%;
        box-shadow: 8px 8px 10px #888888;
        border-radius: 5px;
    }
    #friendAvatar{
        position:relative;
        top:30px;
        left:140px;
    }
    #friendNickname{
        position:relative;
        top:45px;
        left:140px;
    }
    #friendId{
        position:relative;
        top:60px;
        left:140px;
    }
    #sendmessage{
        position:relative;
        top:80px;
        left:120px;
    }
    #delete{
        position:relative;
        top:80px;
        left:160px;
    }
    
</style>