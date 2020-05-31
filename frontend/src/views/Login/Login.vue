//登录组件
<template>
    <div class="Login">
        <h1>青芒</h1>
<!--        <el-input placeholder="请输入账号" v-model="id" maxlength="15" prefix-icon="el-icon-user-solid" :clearable="true">-->
<!--            -->
<!--        </el-input>-->
        <div class="input-div" @mouseover="showClIcon" @mouseleave="showClearIcon = false">
            <el-input placeholder="请输入账号" v-model="id" maxlength="15" prefix-icon="el-icon-user-solid" @input="showClIcon">
                <el-button  class="Icon" v-if="showClearIcon" slot="suffix" type="text" icon="el-icon-error" @click="clearInput"></el-button>
            </el-input>
        </div>
            <span  v-if="idRemind" id="foundRemind">{{idTips}}</span>
            <br/>
<!--        <el-input  placeholder="请输入密码"  v-model="password" maxlength="16" prefix-icon="el-icon-lock" show-password></el-input>-->
        <div class="input-div" @mouseover="showPassIcon" @mouseleave="showPasswordIcon = false" >
            <form>
                <el-input  placeholder="请输入密码"  :type="passwordType" v-model="password" maxlength="16" prefix-icon="el-icon-lock" @input="showPassIcon">
                    <el-button  class="Icon" v-if="showPasswordIcon" slot="suffix" type="text" icon="el-icon-view" @click="showPass"></el-button>
                </el-input>
            </form>
        </div>
             <span  v-if="passwordRemind" id="passwordRemind">{{passwordTips}}</span>
        <br/>
        <el-button id="login-submit" :loading="isLoading" @click="login" >{{loginText}}</el-button>
        <br/>
        <el-button id="register"  type="text" @click="register">创建账号</el-button>
    </div>
</template>

<script>
    export default {
        name:"login",
        mounted() {
            let id = window.localStorage.getItem("username");
            console.log("已登录用户:",id);
            if(id != null)
            {
                let tips = "用户"+id;
                tips += "已登录, 即将跳转至主页";
                this.$message({message:tips,type:"warning"});
                setTimeout(function(){window.location.href = "home"},2000);
            }
        },
        data(){
            return {
                //账号
                id: "",
                //密码
                password: "",
                //是否显示id输入提示
                idRemind: false,
                //是否显示密码输入提示
                passwordRemind:false,
                //id输入提示文本
                idTips:"",
                //密码输入提示文本
                passwordTips:"",
                //按钮是否显示加载图标
                isLoading:false,
                //按钮文本
                loginText:"登录",
                //密码输入栏文本类型
                passwordType:"password",
                //是否显示密码图标
                showPasswordIcon:false,
                //是否显示清除ID图标
                showClearIcon:false,
            }
        },
        methods:{
            //提交登录处理
            login(){
                if(this.id === "")
                    this.$message({message:"账号不能为空",type:"warning"});
                else if(this.password === "")
                    this.$message({message:"密码不能为空",type:"warning"});
                else{
                    this.isLoading = true;
                    this.loginText = "登录中...";
                    this.$axios.post("/login",{
                        username:this.id,
                        password:this.password
                    })
                        .then((result)=>{
                        console.log(result);
                        this.$message({message:"登录成功",type:"success"});
                        window.localStorage.setItem("username",this.id);
                        window.location.href = "home";
                    })
                        .catch((error)=>{
                        // console.log(error.response.status);
                        this.isLoading = false;
                        this.loginText = "登录";
                        console.log(error.response.status);
                        if(error.response.status === 401)
                            this.$message({message:"登录失败：密码错误",type:"error"});
                        else if(error.response.status === 402)
                            this.$message({message:"登录失败：账号不存在",type:"error"});
                        else if(error.response.status === 403) {
                            this.$message({message:"该用户已登录",type:"warning"});
                            //setTimeout(function(){window.location.href = "home"},2000);
                        }
                        else
                            this.$message({message:"服务器未响应",type:"warning"});
                    })
                }
            },
            //跳转至注册页面
            register(){
                window.location.href = "register";
            },
            //密码输入栏切换显示
            showPass(){
                if(this.passwordType === "password")
                    this.passwordType = "text";
                else
                    this.passwordType = "password";
            },
            //显示密码图标
            showPassIcon(){
                if(this.password !=="")
                    this.showPasswordIcon = true;
            },
            //显示id清除图标
            showClIcon(){
                if(this.id !=="")
                    this.showClearIcon = true;
            },
            //清除id输入
            clearInput(){
                this.id="";
            },
        },
        watch:{
            //验证id输入合法性
            id(val){
                if(val === "")
                {
                    this.idRemind = true;
                    this.idTips = "账号不能为空";
                }
                else this.idRemind = false;
            },
            //验证密码输入合法性
            password(val){
                if(val === "")
                {
                    this.passwordRemind = true;
                    this.passwordTips = "密码不能为空";
                }
                else this.passwordRemind = false;
            }
        }
    };

</script>
<style  lang="css" scoped>
    .Login >>>.el-input{
        width: 440px;
        height: 60px;
        font-size: 25px;
        margin-top: 43px;
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
    #login-submit{
        margin-top: 43px;
        width: 440px;
        height: 60px;
        line-height: 29px;
        border-radius: 30px;
        background-color: rgba(58, 98, 215, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 20px;
        text-align: center;
        font-family: Roboto;
        border: 1px solid rgba(58, 98, 215, 1);
    }
    #login-submit:hover{
        background-color: rgb(41, 48, 215);
    }
    #register{
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
        font-family: Roboto;
        border: 1px solid rgba(255, 255, 255, 0);

    }
    #register:hover{
        opacity: 1;
        color: rgb(255, 253, 253);
    }
    #foundRemind,#passwordRemind{
        position: absolute;
        margin-top: 60px;
        margin-left: 30px;
        font-size: 18px;
        color: #ff0000c2;
    }
    .Login{
        width:50%;
        padding: 20px;
        margin: 60px auto;
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
