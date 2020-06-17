//登录组件
<template>
    <div class="Login" >
        <h1>青芒</h1>
        <div class="input-div" @mouseover="showClIcon" @mouseleave="showClearIcon = false">
            <el-input placeholder="请输入账号" v-model="id" maxlength="15" prefix-icon="el-icon-user-solid" @input="showClIcon">
                <el-button  class="Icon" v-if="showClearIcon" slot="suffix" type="text" icon="el-icon-error" @click="clearInput"></el-button>
            </el-input>
        </div>
            <span  v-if="idRemind" id="foundRemind">{{idTips}}</span>
            <br/>
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
    let Base64 = require('js-base64').Base64;
    const duration_time = 1000; //提示持续时间
    export default {
        name:"login",
        mounted() {
            let id = window.localStorage.getItem("username");
            if(id != null)
            {
                let decode_id = Base64.decode(id);
                id = decode_id.substr(3);
                let tips = "用户"+id;
                tips += "已登录, 即将跳转至主页";
                this.$message({message:tips,type:"warning",duration:duration_time});
                setTimeout(()=>{
                    this.$router.push("/Home");
                },duration_time);
            }
            if(this.$route.params.register_id) {
                this.id = this.$route.params.register_id;
                this.password = this.$route.params.register_password;
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
                    this.$message({message:"账号不能为空",type:"warning",duration:duration_time});
                else if(this.password === "")
                    this.$message({message:"密码不能为空",type:"warning",duration:duration_time});
                else{
                    this.isLoading = true;
                    this.loginText = "登录中...";
                    this.$socket.emit('userLogin',this.id,this.password,(result)=>{
                        console.log("登录接口返回:",result);
                        if(result.status === 2)
                        {
                            let encode_id = Base64.encode(+ "qm3"+this.id );    //加密账号
                            let t = "q1m4"+this.password;
                            let encode_password = Base64.encode(t ); //加密密码
                            window.localStorage.setItem("username",encode_id);  //保存到本地
                            window.localStorage.setItem("password",encode_password);    //保存到本地
                            this.$message({message:"登录成功，即将跳转至主页",type:"success",duration:duration_time});
                            setTimeout(()=>{
                                this.$router.push("/Home");
                            },500);
                        }
                        else if(result.status === 1) {
                            if(result.reason === 0)
                                this.$message({message:"未查找到该用户",type:"warning",duration:duration_time});
                            else if(result.reason === 1)
                                this.$message({message:"密码错误",type:"error",duration:duration_time});
                            else if(result.reason === 2)
                                this.$message({message:"您已登录，请不要重复登录",type:"warning",duration:duration_time});
                        }
                        else if(result.status === 0)
                            this.$message({message:"请求参数错误",type:"error",duration:duration_time});
                        else
                            this.$message({message:"服务器无响应",type:"warning",duration:duration_time});
                        this.isLoading = false;
                        this.loginText = "登录";

                    });
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
        },
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
