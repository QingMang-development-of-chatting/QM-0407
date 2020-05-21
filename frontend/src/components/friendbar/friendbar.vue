//好友侧边栏组件
<template>
    <div class="friendbar">
        <el-input  placeholder="请输入好友姓名" v-model="input" clearable suffix-icon="el-icon-search"></el-input>
        <div class="addFriend" @click="showAdd">
            <i id="addIcon" class="el-icon-circle-plus el-icon--right"></i>
            <span class="addText">新的朋友</span>
        </div>
        <el-menu class="friendbar-main">
            <el-menu-item class="friendList" v-for="(friend,key) in friendList" :key="key" @click="showFriend()">
                <el-avatar class="avatar" shape="square" :size="58" fit="cover" :src="friend.avatar"></el-avatar>
                <span class="nickname">{{friend.nickname}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        props: {
            friendList:Object
        },
        data(){
            return{
                input: "",
            }
        },
        methods:{
            showAdd(){
                this.$emit('showAdd');
            },
            showFriend(){
                this.$emit('showFriend');
            }
        }

    };
</script>
<style  lang="css" scoped>
    .friendbar{
        background-color: #e6e6e5;
        height: inherit;
    }
    .avatar{
        position: relative;
        top: 10px;
        left: -5px
    }
    .addFriend{
        font-size: 18px;
        box-sizing: border-box;
        background-color: #e6e6e5;
        text-align: left;
        height: 9%;
        color:black;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
    }
    .friendList{
        background-color: #e6e6e5;
        text-align: left;
        height: 80px;
        box-sizing: border-box;
        color:black;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03)
    }
    .friendList:hover,.addFriend:hover{
        background-color: #d2d2d1;
    }
    .nickname{
        font-size: large;
        position: relative;
        left: 10px;
        top:10px;
    }
    .friendbar>>>.el-input{
        width:80% ;
        height: 9%;
        box-sizing: border-box;
        padding-top: 12px ;
        padding-bottom: 12px ;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
        position:relative;
        left:-20px;
    }
    #addIcon{
        color: #ffa705cc;
        position: relative;
        top:4px;
        left: 10px;
        font-size: 52px;
        margin-right: 35px;
    }
    .friendbar-main{
        box-sizing: border-box;
        height:82%;
        overflow-y: auto;
    }
    .addText{
        position: relative;
        top:-8px;
        left:-1px;
    }
</style>
