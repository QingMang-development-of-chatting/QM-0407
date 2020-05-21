<template>
    <div class="addFriend">
        <div class="addHead">
            <span class="headText">新的朋友</span>
        </div>
        <div class="addApply">
            <div class="input-div" @mouseover="showClIcon" @mouseleave="showClearIcon = false">
                <el-input placeholder="请输入用户账号" v-model="searchId" maxlength="15"  @input="showClIcon">
                    <el-button  class="Icon" v-if="showClearIcon" slot="suffix" type="text" icon="el-icon-error" @click="clearInput"></el-button>
                </el-input>
                <el-button id="searchButton" @click="searchUser(searchId)" icon="el-icon-search">查找</el-button>
            </div>
            <div  v-if="idRemind" id="idRemind">{{idTips}}</div>
            <div v-if="showFound" id="foundUser">
                <el-avatar  id="foundUserAvatar" shape="square" :size="110" fit="cover" :src="foundUser.avatar" ></el-avatar>
                <br/>
                <span id="foundUserId">账号：{{foundUser.id}}</span>
                <br/>
                <span id="foundUserNickname">昵称：{{foundUser.nickname}}</span>
                <br/>
                <el-button  id="addFriendButton" icon="el-icon-circle-plus" @click="addFriend(foundUser.id)">添加好友</el-button>
            </div>
        </div>
        <div class="addMessages">
            <div class="applyHead">好友申请</div>
            <div class="applyList">
                <div class="applyItem" v-for="applyMessage in applyMessages" :key="applyMessage.index">
                    <el-avatar class="applyAvatar" shape="square" :size="60" fit="cover" :src="applyMessage.avatar"></el-avatar>
                    <span class="applyNickname">{{applyMessage.nickname}}</span>
                    <span class="acceptText" v-if="applyMessage.dispose == 1">已接受</span>
                    <span class="rejectText" v-if="applyMessage.dispose == -1">已拒绝</span>
                    <el-button class="acceptButton" circle icon="el-icon-check" v-if="applyMessage.dispose == 0" @click="accept(applyMessage.id)"></el-button>
                    <el-button class="rejectButton" circle  icon="el-icon-close" v-if="applyMessage.dispose == 0" @click="reject(applyMessage.id)"></el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            //申请信息
            applyMessages:Array,
            //查找到的用户
            foundUser:Object,
            //是否显示查找到的用户
            showFound:Boolean,
        },
        data(){
            return{
                //查找用户账号
                searchId:"",
                //是否显示清除图标
                showClearIcon:false,
                //是否显示查找结果提示
                idRemind:false,
                //查找结果提示文本
                idTips:"",
                //查找结果
            }
        },
        methods:{
            //显示清除图标
            showClIcon() {
                if(this.searchId !== "")
                    this.showClearIcon = true;
            },
            //清除输入
            clearInput(){
                this.searchId = "";
            },
            //点击接受触发accept事件
            accept(id){
                this.$emit('accept',id)
            },
            //点击拒绝触发reject事件
            reject(id){
                this.$emit('reject',id);
            },
            //触发添加好友事件
            addFriend(id){
                this.$emit('addFriend',id);
            },
            //触发查找用户事件
            searchUser(id){
                this.$emit('searchUser',id);
            },
        },
        watch:{
            //检测输入栏是否为空
            searchId(val){
                if (val==="")
                    console.log("账号不能为空");
            }

        }
    };
</script>
<style  lang="css" scoped>
    .addFriend >>>.el-input{
        width: 440px;
        height: 50px;
        font-size: 20px;
        margin-top: 30px;
    }
    .el-input >>>.el-input__inner{
        padding-left: 50px !important;
        width: 320px;
        height: 45px;
        line-height: 20px;
        opacity: 0.9;
        border: 1px solid rgba(255, 255, 255, 1);
        letter-spacing: 3px;
    }
    [class^=el-icon-], >>> [class*=" el-icon-"]{
        display:contents !important;
        font-size: 29px !important;
        color: rgb(255, 255, 255) !important;
    }
    .el-input >>>.el-input__suffix{
        right: 70px !important;
    }
    .Icon{
        font-size: 22px;
        color: #d6d6d6;
    }
    .input-div{
        display: inline;
    }
    .addHead{
        height:9%;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
        text-align: left;
    }
    .headText{
        position: relative;
        font-size: 22px;
        top:14px;
        left:30px;
    }
    .addApply{
        height: 50%;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
    }
    #searchButton{
        height: 45px;
        border-color: rgba(48, 49, 51, 0.05);
        background-color: #ffffff;
        color: #6b6b6b;
        font-size: 15px;
    }
    #searchButton:hover{
        background-color: #acadbb;
        border:unset;
        color:white;
    }
    #idRemind{
        margin-top: 100px;
        font-size: 20px;
        color: #ababab;
    }
    #foundUser{
        text-align: left;
        border-radius: 2px;
        margin: 20px auto;
        width:35%;
        height: 65%;
        background-color: #fefffe;
        border-color: rgba(48, 49, 51, 0.05);
        border-style: ridge;
    }
    #foundUserAvatar{
        position: relative;
        top:25px;
        left:30px;
    }
    #foundUserId{
        position: relative;
        bottom:60px;
        left:160px;
        font-size: large;
    }
    #foundUserNickname{
        position: relative;
        bottom:40px;
        left:160px;
        font-size: large;
    }
    #addFriendButton{
        color: white;
        background-color: #00f000;
        position: relative;
        left:130px;
        font-size: medium;
    }
    #addFriendButton:hover{
        background-color: #00d600;
    }
    .applyHead{
        margin-top: 20px;
        font-size: 18px;
    }
    .applyList{
        text-align: left;
        overflow-y: auto;
        margin: 10px auto;
        width: 500px;
        height:220px;
        background-color: #fafafa;
    }
    .applyItem{
        position: relative;
        border-color: rgba(48, 49, 51, 0.05);
        border-bottom-style: ridge;
    }
    .applyAvatar{
        position: relative;
        left:50px;
        margin-top: 10px;
    }
    .applyNickname{
        position: relative;
        left:60px;
        bottom: 40px;
    }
    .acceptButton{
        background-color: #44fc34;
        position: absolute;
        left:340px;
        bottom: 20px;
        color: white;
    }
    .acceptButton:hover{
        background-color: #00be11;
    }
    .rejectButton{
        background-color: #ff695f;
        position: absolute;
        left:400px;
        bottom: 20px;
        color: white;
    }
    .rejectButton:hover{
        background-color: #ff0013;
    }
    .acceptText{
        position: absolute;
        left:375px;
        bottom: 30px;
        color: #717171;
    }
    .rejectText{
        position: absolute;
        left:375px;
        bottom: 30px;
        color: #717171;
    }
</style>
