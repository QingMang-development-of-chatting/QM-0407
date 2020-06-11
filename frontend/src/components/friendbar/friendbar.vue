//好友侧边栏组件
<template>
    <div class="friendbar">
        <el-input  class="searchBar" placeholder="输入好友昵称查找好友" v-model="searchInput" maxlength="10" clearable prefix-icon="el-icon-search"></el-input>
        <div class="addFriend" @click="showAdd">
            <el-badge :value="NewApplyNumber" :hidden="NewApplyNumber<1">
                <i id="addIcon" class="el-icon-circle-plus el-icon--right"></i>
            </el-badge>
            <span class="addText">新的朋友</span>
        </div>
        <el-menu class="friendbar-main">
            <el-menu-item class="friendList" v-for="(friend,key) in friendList" v-show="search(friend.nickname)" :key="key" @click="showFriend(key,friend.nickname,friend.avatar)">
                <el-avatar class="avatar" shape="square" :size="58" fit="cover" :src="friend.avatar"></el-avatar>
                <span class="nickname">{{friend.nickname}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        props: {
            //好友列表
            friendList:Object,
            //未处理申请数目
            NewApplyNumber:Number,
        },
        data(){
            return{
                searchInput: "",
            }
        },
        methods:{
            showAdd(){
                this.$emit('showAdd');
            },
            showFriend(id,nickname,avatar){
                this.$emit('showFriend',id,nickname,avatar);
                console.log("好友：",id,nickname,avatar);
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
        font-size: 15px;
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
        top:10px;
    }
    .el-badge >>> .el-badge__content{
        right: 40px;
        top: 15px;
        background-color: #f51500;
    }
    .searchBar >>> .el-input__inner{
        padding-left: 45px !important;
    }
    .searchBar >>> .el-input__prefix{
        padding-left: 10px !important;
    }
</style>
