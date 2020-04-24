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
            <span  v-if="idRemind" id="idRemind">{{idTips}}</span>
            <br/>
<!--        <el-input  placeholder="请输入密码"  v-model="password" maxlength="16" prefix-icon="el-icon-lock" show-password></el-input>-->
        <div class="input-div" @mouseover="showPassIcon" @mouseleave="showPasswordIcon = false" >
            <el-input  placeholder="请输入密码"  :type="passwordType" v-model="password" maxlength="16" prefix-icon="el-icon-lock" @input="showPassIcon">
                <el-button  class="Icon" v-if="showPasswordIcon" slot="suffix" type="text" icon="el-icon-view" @click="showPass"></el-button>
            </el-input>
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
            this.$store.state.username = window.localStorage.getItem("username");
            console.log(this.$store.state.username);
            if(this.$store.state.username != null)
            {
                this.$message({message:"您已登录, 即将跳转至主页",type:"warning"});
                setTimeout(function(){window.location.href = "home"},2000);
            }
        },
        data(){
            return {
                id: "",
                password: "",
                idRemind: false,
                passwordRemind:false,
                idTips:"",
                passwordTips:"",
                isLoading:false,
                loginText:"登录",
                passwordType:"password",
                showPasswordIcon:false,
                showClearIcon:false,
            }
        },
        methods:{
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
                    }).then((result)=>{
                        console.log(result);
                        this.$message({message:"登录成功",type:"success"});
                        window.localStorage.setItem("username",this.id);
                        this.$store.commit('setUser',this.id);
                        window.location.href = "home";
                    }).catch((error)=>{
                        console.log(error.response.status);
                        this.isLoading = false;
                        this.loginText = "登录";
                        if(error.response.status === 400)
                            this.$message({message:"登录失败：账号或者密码错误",type:"error"});
                        else if(error.response.status === 403) {
                            this.$message({message:"该用户已登录",type:"warning"});
                            //setTimeout(function(){window.location.href = "home"},2000);
                        }
                        else
                            this.$message({message:"服务器未响应",type:"warning"});
                    })
                }
            },
            register(){
                window.location.href = "register";
            },
            showPass(){
                if(this.passwordType === "password")
                    this.passwordType = "text";
                else
                    this.passwordType = "password";
            },
            showPassIcon(){
                if(this.password !=="")
                    this.showPasswordIcon = true;
            },
            showClIcon(){
                if(this.id !=="")
                    this.showClearIcon = true;
            },
            clearInput(){
                this.id="";
            },
        },
        watch:{
            id(val){
                if(val === "")
                {
                    this.idRemind = true;
                    this.idTips = "账号不能为空";
                }
                else this.idRemind = false;
            },
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
    #idRemind,#passwordRemind{
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



</style>
