//注册组件
<template>
    <div class="register">
        <h1>青芒</h1>
        <el-tooltip class="item" effect="dark" content="输入3到15位字母、数字、下划线组合" placement="top-start">
<!--            <el-input placeholder="请输入用户名" v-model="id" maxlength="15"    prefix-icon="el-icon-user-solid" clearable></el-input>-->
            <div class="input-div" @mouseover="showClIdIcon" @mouseleave="showClearIdIcon = false" >
                <el-input placeholder="请输入用户名" v-model="id" maxlength="15"    prefix-icon="el-icon-user-solid" @input="showClIdIcon">
                     <el-button class="Icon" v-if="showClearIdIcon" slot="suffix" type="text" icon="el-icon-error" @click="clearIdInput"></el-button>
                 </el-input>
            </div>
        </el-tooltip>
        <span  v-if="idRemind" id="foundRemind">{{idTips}}</span>
        <br/>
        <el-tooltip class="item" effect="dark" content="输入8到16位字符组合" placement="top-start">
<!--            <el-input  placeholder="请输入密码"  v-model="password" maxlength="16" prefix-icon="el-icon-lock" show-password></el-input>-->
            <div class="input-div"  @mouseover="showPassIcon" @mouseleave="showPasswordIcon = false">
                <form >
                    <el-input  placeholder="请输入密码" :type="passwordType" v-model="password" maxlength="16" prefix-icon="el-icon-lock" @input="showPassIcon">
                        <el-button  class="Icon" v-if="showPasswordIcon" slot="suffix" type="text" icon="el-icon-view" @click="showPass"></el-button>
                    </el-input>
                </form>
            </div>
        </el-tooltip>
        <span  v-if="passwordRemind" id="passwordRemind">{{passwordTips}}</span>
        <br/>
        <div class="input-div" @mouseover="showPassIcon1" @mouseleave="showPasswordIcon1 = false">
            <form>
                <el-input  placeholder="请再次输入密码"  :type="passwordConfirmType" v-model="password1" maxlength="16" prefix-icon="el-icon-lock" @input="showPassIcon1">
                    <el-button  class="Icon" v-if="showPasswordIcon1" slot="suffix" type="text" icon="el-icon-view" @click="showPass1"></el-button>
                </el-input>
            </form>
        </div>
        <span  v-if="passwordConfirm" id="passwordConfirm">{{confirmTips}}</span>
        <br/>
        <el-tooltip class="item" effect="dark" content="输入1到10位中英字符组合" placement="top-start">
<!--            <el-input  placeholder="请输入昵称"  v-model="nickname" maxlength="10" prefix-icon="el-icon-edit-outline" clearable></el-input>-->
            <div class="input-div" @mouseover="showClNickIcon" @mouseleave="showClearNickIcon=false">
                <el-input  placeholder="请输入昵称"  v-model="nickname" maxlength="10" prefix-icon="el-icon-edit-outline" @input="showClNickIcon">
                    <el-button class="Icon" v-if="showClearNickIcon" slot="suffix" type="text" icon="el-icon-error" @click="clearNickInput"></el-button>
                </el-input>
            </div>
        </el-tooltip>
        <span  v-if="nicknameRemind" id="nicknameRemind">{{nicknameTips}}</span>
        <br/>
        <el-button id="register-submit" @click="register" :loading="isLoading">{{registerText}}</el-button>
        <br/>
        <el-button id="login"  @click="login" type="text">登录</el-button>
    </div>
</template>

<script>
    const usernamePat = /^[a-zA-Z0-9_-]{3,15}$/;
    export default {
        name: "register",
        data(){
            return{
                //账号
                id: "",
                //密码
                password: "",
                //确认密码
                password1:"",
                //昵称
                nickname:"",
                //注册按钮文本
                registerText:"注册",
                //密码输入栏类型
                passwordType:"password",
                //密码确认栏类型
                passwordConfirmType:"password",
                //是否显示id输入提示
                idRemind:false,
                //是否显示密码输入提示
                passwordRemind:false,
                //是否显示密码确认提示
                passwordConfirm:false,
                //是否显示昵称输入提示
                nicknameRemind:false,
                //注册按钮是否显示加载
                isLoading:false,
                //是否显示id输入栏清除图标
                showClearIdIcon:false,
                //是否显示密码输入栏密码图标
                showPasswordIcon:false,
                //是否显示密码确认栏密码图标
                showPasswordIcon1:false,
                //是否显示昵称输入栏清除图标
                showClearNickIcon:false,
            }
        },
        methods:{
            //提交注册处理
            register(){
                if(this.id === "")
                {
                    this.$message({message:"账号不能为空",type:"warning"});
                }
                else if(!usernamePat.test(this.id)){
                    this.$message({message:"账号不合法",type:"warning"});
                }
                else if(this.password === "")
                {
                    this.$message({message:"密码不能为空",type:"warning"});
                }
                else if(this.password.length < 8){
                    this.$message({message:"密码过短",type:"warning"});
                }
                else if(this.passwordConfirm === true)
                {
                    this.$message({message:"两次密码输入不一致", type:"warning"});
                }
                else if(this.nickname === "")
                {
                    this.$message({message:"昵称不能为空", type:"warning"});
                }
                else{
                    this.isLoading = true;
                    this.registerText = "提交注册中...";
                    this.$axios.post("register",  {
                        username: this.id,
                        password: this.password,
                        nickname: this.nickname
                    })
                        .then((result)=>{
                        console.log(result);
                        this.isLoading = false;
                        this.registerText = "注册";
                        this.$confirm('注册成功, 是否跳转至登录页面?', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            confirmButtonClass:'confirmButton',
                            cancelButtonClass:'cancelButton',
                            type: 'info',
                            center: true
                        })
                            .then(() => {
                            this.$message({message:"即将跳转至登录页面",type:"success"});
                            window.location.href = "login";
                        });
                    })
                        .catch((error)=>{
                        console.log(error.response.status);
                        if(error.response.status === 400)
                            this.$message({message:"注册失败，该账号已被使用",type:"error"});
                        else if(error.response.status == 403)
                            this.$message({message:"您已登录，不可注册",type:"warning"});
                        else
                            this.$message({message:"服务器未响应",type:"warning"});
                        this.isLoading = false;
                        this.registerText = "注册";
                    })
                }
            },
            //跳转至登录页面
            login(){
                window.location.href = "login";
            },
            //显示id清除图标
            showClIdIcon(){
                if(this.id !=="")
                    this.showClearIdIcon = true;
            },
            //清除id输入栏文本
            clearIdInput(){
                this.id="";
            },
            //显示密码输入栏密码图标
            showPassIcon(){
                if(this.password !=="")
                    this.showPasswordIcon = true;
            },
            //切换密码输入栏文本显示
            showPass(){
                if(this.passwordType === "password")
                    this.passwordType = "text";
                else
                    this.passwordType = "password";
            },
            //显示密码确认栏密码图标
            showPassIcon1(){
                if(this.password1 !=="")
                    this.showPasswordIcon1 = true;
            },
            //切换密码确认栏文本显示
            showPass1(){
                if(this.passwordConfirmType === "password")
                    this.passwordConfirmType = "text";
                else
                    this.passwordConfirmType = "password";
            },
            //显示昵称清除图标
            showClNickIcon(){
                if(this.nickname !=="")
                    this.showClearNickIcon = true;
            },
            //清除昵称输入栏文本
            clearNickInput(){
                this.nickname="";
            },

        },
        watch:{
            //验证id输入合法性
            id(val){
              if(val === "")
              {
                  this.idTips = "账号不能为空";
                  this.idRemind = true;

              }
              else if(!usernamePat.test(val))
              {
                  this.idTips = "账号不合法";
                  this.idRemind = true;
              }
              else{
                  this.idRemind = false;
              }
            },
            //验证密码输入合法性
            password(val){
                if(val === "") {
                    this.passwordTips = "密码不能为空";
                    this.passwordRemind = true;
                }
                else if(val.length < 8){
                    this.passwordTips = "密码过短";
                    this.passwordRemind = true;
                }
                else{
                    this.passwordRemind = false;
                }
                if(this.password1!=="") {
                    if(val !== this.password1)
                    {
                        this.confirmTips = "两次密码输入不一致";
                        this.passwordConfirm = true;
                    }
                    else{
                        this.passwordConfirm = false;
                    }
                }
            },
            //验证两次密码输入是否一致
            password1(val){
                if(val !== this.password)
                {
                    this.confirmTips = "两次密码输入不一致";
                    this.passwordConfirm = true;
                }
                else{
                    this.passwordConfirm = false;
                }
            },
            //验证昵称输入合法性
            nickname(val){
                if(val === "")
                {
                    this.nicknameTips = "昵称不能为空";
                    this.nicknameRemind = true;
                }
                else
                {
                    this.nicknameRemind = false;
                }
            }
        }

    };
</script>
<style  lang="css" scoped>
    .register >>>.el-input{
        width: 440px;
        height: 60px;
        font-size: 25px;
        margin-top: 35px;
    }
    .el-input >>>.el-input__inner{
        padding-left: 100px !important;
        width: 440px;
        height: 60px;
        line-height: 20px;
        opacity: 0.5;
        border-radius: 30px;;
        border: 1px solid rgba(255, 255, 255, 1);
        letter-spacing: 3px;
    }
    [class^=el-icon-], >>> [class*=" el-icon-"]{
        display:contents !important;
        font-size: 29px !important;
        color: rgb(255, 255, 255) !important;
    }
    .el-input >>>.el-input__prefix{
        left:40px !important;
    }
    .el-input >>>.el-input__suffix{
        right: 40px !important;
    }
    #register-submit{
        margin-top: 35px;
        width: 440px;
        height: 60px;
        line-height: 29px;
        border-radius: 30px;
        background-color: rgba(58, 98, 215, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 20px;
        text-align: center;
        border: 1px solid rgba(58, 98, 215, 1);
    }
    #register-submit:hover{
        background-color: rgb(41, 48, 215);
    }
    #login{
        margin-top: 18px;
        position: relative;
        left:140px;
        width: 158px;
        height: 56px;
        line-height: 29px;
        opacity: 0.65;
        background-color: rgba(255, 255, 255, 0);
        color: rgba(227, 225, 225, 1);
        font-size: 20px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0);
    }
    #login:hover{
        opacity: 1;
        color: rgb(255, 253, 253);
    }
    #foundRemind,#nicknameRemind{
        position: absolute;
        margin-top: 60px;
        margin-left: 30px;
        font-size: 18px;
        color: #ff0000c2;
    }
    #passwordRemind,#passwordConfirm{
        position: absolute;
        margin-top: 60px;
        margin-left: 30px;
        font-size: 18px;
        color: #ff0000c2;
    }
    .register{
        width:50%;
        padding: 20px;
        margin: 0 auto;
    }
    .Icon{
        font-size: 30px;
        color: white;
    }
    .input-div{
        display: inline;
    }
    form{
        display: inline-block;
    }
</style>
<style lang="css">
    .confirmButton{
        background-color: #53affe !important;
        margin-left: -150px !important;
        font-size: 14px;
    }
    .confirmButton:hover{
        background-color: #1c96fe !important;
    }
    .cancelButton{
        font-size: 14px;
        background-color: #cfcfcf !important;
        color: white;
    }
    .cancelButton:hover{
        background-color: #b5b5b5 !important;
        color: white;
    }
</style>
