<template>
    <div class="Home">
        <h1>聊天主页</h1>
        <p>当前用户：{{currentUser}}</p>
        <el-button id="logout"  type="text" @click="logout">注销</el-button>
    </div>
</template>

<script>
    export default {
        name: "home",
        mounted() {
            this.$store.state.username = sessionStorage.getItem("username");
            console.log(this.$store.state.username);
            if(this.$store.state.username == null)
            {
                alert("请先登录");
                window.location.href = "login";
            }
        },
        computed:{
            currentUser(){
                this.$store.commit('setUser',sessionStorage.getItem("username"));
                return this.$store.state.username;
            },
         },
        methods:{
            logout(){
                this.$axios.get("/logout").then(()=>{
                    console.log("已注销");
                    sessionStorage.removeItem("username");
                    window.location.href="login";
                }).catch((error)=>{
                  console.log(error.response);
                })
            }
        },
    };
</script>
