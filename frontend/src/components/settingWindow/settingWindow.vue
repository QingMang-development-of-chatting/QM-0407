//用户信息设置组件
<template>
    <div class="settingWindow">
        <div id="info-head">
            <span id="info-head-text">{{headText}}</span>
            <el-button id="info-close"  size="mini" icon="el-icon-close" @click="closeInfo"></el-button>
        </div>
        <div id="info-avatar" v-if="!changingPassword">
            头像：
            <el-avatar id="avatar"  shape="square" :size="120" fit="cover" :src="avatarUrl" ></el-avatar>
            <el-upload class="settingButton" id="settingButtonAvatar" :action=actionApi :accept=acceptForm :before-upload="prepareAvatar" :http-request="changeAvatar" :show-file-list="false" >
                <i class="el-icon-edit"></i>修改
            </el-upload>
        </div>
        <div id="info-id" v-if="!changingPassword">
            账号：
            {{id}}
        </div>
        <div id="info-nickname" v-if="!changingPassword">昵称：
            <label>
                <input v-if="!isEdit" class="viewNickname" maxlength="10"  :value="nickname" :readonly="true">
            </label>
            <label>
                <input v-if="isEdit" class="viewNickname editNickname" maxlength="10"  v-model="nicknameEdit" >
            </label>
            <el-button class="settingButton" id="settingButtonNickname" type="text" icon="el-icon-edit" @click="editNickname(nicknameEdit)">{{editButtonText}}</el-button>
        </div>
        <div id="info-oldPassword" v-if="changingPassword" class="input-div" @mouseover="showPassIcon0" @mouseleave="showPasswordIcon0 = false">
            旧密码：
            <form>
                <el-input class="passwordInput" placeholder="请输入旧密码" :type="oldPasswordType" maxlength="16"  v-model="oldPassword" @input="showPassIcon0">
                    <el-button  class="Icon" v-if="showPasswordIcon0" slot="suffix" type="text" icon="el-icon-view" @click="showPass0"></el-button>
                </el-input>
            </form>
        </div>
        <div id="info-newPassword" v-if="changingPassword" class="input-div" @mouseover="showPassIcon1" @mouseleave="showPasswordIcon1 = false">
            新密码：
            <form>
                <el-input class="passwordInput" placeholder="请输入新密码" :type="newPasswordType" maxlength="16"  v-model="newPassword"  @input="showPassIcon1">
                    <el-button  class="Icon" v-if="showPasswordIcon1" slot="suffix" type="text" icon="el-icon-view" @click="showPass1"></el-button>
                </el-input>
            </form>
        </div>
        <div id="info-confirmPassword" v-if="changingPassword" class="input-div" @mouseover="showPassIcon2" @mouseleave="showPasswordIcon2 = false">
            确认密码：
            <form>
            <el-input class="passwordInput" placeholder="请再次输入密码" :type="confirmPasswordType" maxlength="16"  v-model="confirmPassword" @input="showPassIcon2">
                <el-button  class="Icon" v-if="showPasswordIcon2" slot="suffix" type="text" icon="el-icon-view" @click="showPass2"></el-button>
            </el-input>
            </form>
        </div>
        <el-button id="changePasswordButton"  v-if="changingPassword" @click="changePassword">提交修改</el-button>
        <el-button id="switchButton" @click="switchShow" :icon=switchIcon>{{switchText}}</el-button>
    </div>
</template>

<script>
    let Base64 = require('js-base64').Base64;
    export default {
        props: {
            id: String,
            nickname: String,
            avatarUrl: String,
            changingPassword: Boolean
        },
        data(){
            return{
                isEdit:false,
                headText:"我的资料",
                editButtonText:"修改",
                nicknameEdit:"",
                actionApi:"",
                acceptForm:"image/png,image/jpg,image/jpeg",
                oldPassword:"",
                newPassword:"",
                confirmPassword:"",
                oldPasswordType:"password",
                newPasswordType:"password",
                confirmPasswordType:"password",
                showPasswordIcon0:false,
                showPasswordIcon1:false,
                showPasswordIcon2:false,
                switchIcon:"el-icon-key",
                switchText:"修改密码",
            }
        },
        methods:{
            //修改昵称
            editNickname(nicknameEdit){
                if (this.isEdit) {
                    if(nicknameEdit.length > 10)
                        this.$message({message:"昵称长度不可超过10个字",type:"warning",duration:1000});
                    else if(nicknameEdit === "")
                        this.$message({message:"昵称不能为空",type:"warning",duration:1000});
                    else{
                        this.$emit('changeNickname', nicknameEdit);
                        this.editButtonText = "修改";
                        this.isEdit = false;
                    }
                }
                else {
                    this.editButtonText = "保存";
                    this.isEdit = true;
                }
            },
            //关闭资料栏显示
            closeInfo(){
                this.$emit('closeInfo');
            },
            //判断头像大小格式是否符合
            prepareAvatar(file){
                let format = file.name.substring(file.name.lastIndexOf('.')+1);
                if(format !=='jpg' && format !=='jpeg' && format!=='png') {
                    this.$message({message: '上传头像只能是 jpg、png格式', type: 'warning',duration:1000});
                    return false;
                }
                if(file.size>1024*1024*5) {
                    this.$message({message: '上传头像大小不能超过 5MB!', type: 'warning',duration:1000});
                    return false;
                }
                return true;
            },
            //修改头像
            changeAvatar(file){
                this.$emit('changeAvatar',file);
            },
            //切换资料与修改密码显示
            switchShow(){
                console.log(this.changingPassword);
                if(this.changingPassword)
                {
                    this.headText = "我的资料";
                    this.switchIcon = "el-icon-key";
                    this.switchText = "修改密码";
                }
                else
                {
                    this.headText = "修改密码";
                    this.oldPasswordType = "password";
                    this.newPasswordType = "password";
                    this.confirmPasswordType = "password";
                    this.showPasswordIcon0 = false;
                    this.showPasswordIcon1 = false;
                    this.showPasswordIcon2 = false;
                    this.oldPassword = "";
                    this.newPassword = "";
                    this.confirmPassword = "";
                    this.switchIcon = "el-icon-user";
                    this.switchText = "查看资料";
                }
                this.$emit('switchShow');
            },
            //显示旧密码输入栏密码图标
            showPassIcon0(){
                if(this.oldPassword !=="")
                    this.showPasswordIcon0 = true;
            },
            //切换旧密码输入栏文本显示
            showPass0(){
                if(this.oldPasswordType === "password")
                    this.oldPasswordType = "text";
                else
                    this.oldPasswordType = "password";
            },
            //显示新密码输入栏密码图标
            showPassIcon1(){
                if(this.newPassword !=="")
                    this.showPasswordIcon1 = true;
            },
            //切换新密码输入栏文本显示
            showPass1(){
                if(this.newPasswordType === "password")
                    this.newPasswordType = "text";
                else
                    this.newPasswordType = "password";
            },
            //显示确认密码输入栏密码图标
            showPassIcon2(){
                if(this.confirmPassword !=="")
                    this.showPasswordIcon2 = true;
            },
            //切换确认密码输入栏文本显示
            showPass2(){
                if(this.confirmPasswordType === "password")
                    this.confirmPasswordType = "text";
                else
                    this.confirmPasswordType = "password";
            },
            //提交修改密码
            changePassword(){
                let password = window.localStorage.getItem('password');
                let decode_password = Base64.decode(password);
                password = decode_password.substr(4);
                if(this.oldPassword !== password)
                    this.$message({message:'旧密码验证错误',type:'warning',duration:1000});
                else if(this.newPassword === this.oldPassword)
                    this.$message({message:'新密码与旧密码相同',type:'warning',duration:1000});
                else if(this.newPassword.length<8)
                    this.$message({message:'新密码长度过短',type:'warning',duration:1000});
                else if(this.confirmPassword !== this.newPassword)
                    this.$message({message:'两次密码输入不一致',type:'warning',duration:1000});
                else{
                    let t = this.newPassword;
                    this.$emit('changePassword',t);
                }

            }
        }
    };

</script>
<style lang="css" scoped>
    .settingWindow{
        font-size: 20px;
        background: rgba(249, 249, 249, 0.98);
        width: 480px;
        height: 370px;
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
        top:25px;
        left:110px;
    }
    #info-id{
        position:relative;
        top:15px;
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
    #switchButton{
        text-align: center;
        position: absolute;
        bottom: 20px;
        right:160px;
        font-size: 15px;
        background-color: rgba(180, 180, 179, 0.39);
        border-color: #e1e1e1;
        color: #000000;
        opacity: 30%;
    }
    #switchButton:hover{
        opacity: 80%;
    }
    .passwordInput{
        font-size: 18px;
        width: 200px;
        height: 30px;
    }
    form{
        display: inline-block;
    }
    .Icon{
        font-size: 20px;
        color: #b4b4b4;
    }
    .input-div{
        display: inline-block;
    }
    #info-oldPassword{
        position: absolute;
        top:75px;
        left:80px;
    }
    #info-newPassword{
        position: absolute;
        top:130px;
        left:80px;

    }
    #info-confirmPassword{
        position: absolute;
        top:185px;
        left:60px;
    }
    #changePasswordButton{
        position: absolute;
        top:245px;
        left:320px;
        font-family: inherit;
        color: #141414;
        background-color: #9bbfd3;
        opacity: 80%;
    }
    #changePasswordButton:hover{
        color: #141414;
        opacity: 100%;

    }

</style>
