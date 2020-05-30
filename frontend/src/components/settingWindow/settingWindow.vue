//用户信息设置组件
<template>
    <div class="settingWindow" >
        <div id="info-head">
            <span id="info-head-text">我的资料</span>
            <el-button id="info-close"  size="mini" icon="el-icon-close" @click="closeInfo"></el-button>
        </div>
        <div id="info-avatar">
            头像：
            <el-avatar id="avatar"  shape="square" :size="120" fit="cover" :src="avatarUrl" ></el-avatar>
<!--            <el-button class="settingButton"  id="settingButtonAvatar" type="text" icon="el-icon-edit">修改</el-button>-->

            <el-upload class="settingButton" id="settingButtonAvatar" :action=actionApi :accept=acceptForm  :http-request="changeAvatar" :show-file-list="false" >
                <i class="el-icon-edit"></i>修改
            </el-upload>
        </div>
        <div id="info-id">
            账号：
            {{id}}
        </div>
        <div id="info-nickname">昵称：
            <input v-if="!isEdit" class="viewNickname" maxlength="10"  :value="nickname" :readonly="true">
            <input v-if="isEdit" class="viewNickname editNickname" maxlength="10"  v-model="nicknameEdit" >
            <el-button class="settingButton" id="settingButtonNickname" type="text" icon="el-icon-edit" @click="editNickname(nicknameEdit)">{{editButtonText}}</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: String,
            nickname: String,
            avatarUrl: String,
        },
        data(){
            return{
                isEdit:false,
                editButtonText:"修改",
                nicknameEdit:"",
                actionApi:"",
                acceptForm:"image/png,image/gif,image/jpg,image/jpeg"
            }
        },
        methods:{
            //修改昵称
            editNickname(nicknameEdit){
                if(this.isEdit) {
                    this.$emit('changeNickname',nicknameEdit);
                    this.editButtonText = "修改";
                    this.isEdit = false;
                }
                else{
                    this.editButtonText = "保存";
                    this.isEdit = true;
                }
            },
            //关闭资料栏显示
            closeInfo(){
                this.$emit('closeInfo');
            },
            //修改头像
            changeAvatar(file){
                this.$emit('changeAvatar',file);
            }
        }
    };

</script>
<style lang="css" scoped>
    .settingWindow{
        font-size: 20px;
        background: rgba(249, 249, 249, 0.98);
        width: 480px;
        height: 360px;
        position: fixed;
        left:50%;
        top:45%;
        margin-top: -180px;
        margin-left: -240px;
        box-shadow: 8px 8px 10px #888888;
        border-radius: 5px;
        text-align: left;
        color: black;
        font-family: sans-serif;
    }
    .viewNickname{
        height: 30px;
        width: 200px;
        border: unset ;
        background-color: inherit ;
        outline: none;
        font-size: inherit;
        font-family: inherit;
    }
    .editNickname{
        border-bottom-style: groove;
    }
    .settingButton{
        font-size: inherit;
    }
    #info-avatar,#info-nickname{
        position:relative;
        top:42px;
        left:110px;
    }
    #info-id{
        position:relative;
        top:35px;
        left:110px;
    }
    #info-head{
        background-color: #e8e6e6;
        border-top-left-radius:inherit ;
        border-top-right-radius: inherit;
        height: 50px;
    }
    #info-close{
        background-color:inherit;
        border: unset;
        height:inherit;
        font-size:20px;
        font-weight: bolder;
        position: relative;
        left:350px;
    }
    #info-close:hover{
        background-color: red;
        color: white;
    }
    #info-head-text{
        position:relative;
        left:20px;
    }
    #settingButtonAvatar{
        position: relative;
        color: teal;
        left:275px;
        bottom:30px;
    }

</style>
