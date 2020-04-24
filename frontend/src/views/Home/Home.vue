<template>
    <div class="Home">
        <el-container id="container" >
            <el-aside id="aside">
                <sidebar :avatar-url="currentUserAvatar" @showInfo="showInfo" @showChat="showChat" @showFriend="showFriend" @logout="logout"></sidebar>
            </el-aside>
            <el-aside id="chat" v-show="isShowChat">
                <chatbar :chatList="chatList" @showChat="toChat"></chatbar>
            </el-aside>
            <el-aside id="friend" v-show="isShowFriend">
                <friendbar :friendList="friendList"></friendbar>
            </el-aside>
            <el-main id="main">
                <div id="init" v-if="isInit">
                    <img class ="logo" :src="logo"  alt="logo">
                </div>
                <chat-area v-if="showChatArea" :friend-nickname="chattingFriendNickname" :friend-avatar="chattingFriendAvatar" :my-avatar="currentUserAvatar" :chatting-info="chattingInfo"></chat-area>
            </el-main>
        </el-container>
        <setting-window v-if="showSetting" :id="currentUser" :nickname="currentUserNickname" :avatar-url="currentUserAvatar" @closeInfo="closeSetting"></setting-window>
    </div>
</template>

<script>
    import mango from '../../assets/mango.png'
    import avatar from '../../assets/default.jpg'
    import avatar1 from '../../assets/可达鸭.jpeg'
    import avatar2 from '../../assets/杰尼龟.jpeg'
    import avatar3 from '../../assets/喵喵怪.jpg'
    import sidebar from "../../components/sidebar/sidebar";
    import chatbar from "../../components/chatbar/chatbar";
    import Friendbar from "../../components/friendbar/friendbar";
    import SettingWindow from "../../components/settingWindow/settingWindow";
    import ChatArea from "../../components/chatArea/chatArea";
    export default {
        name: "home",
        components: {
            ChatArea,
            SettingWindow,
            Friendbar,
            sidebar,
            chatbar
        },
        mounted() {
            this.$store.state.username = window.localStorage.getItem("username");
            console.log(this.$store.state.username);
            if(this.$store.state.username == null)
            {
                alert("请先登录");
                window.location.href = "login";
            }
        },
        data(){
            return{
                chatList:[
                    {id:"user00000",nickname:"可达鸭可达鸭可达鸭可",avatar:avatar1,chatInfo:"可达可达~",time:"4月21日"},
                    {id:"user00001",nickname:"杰尼龟",avatar:avatar2,chatInfo:"杰尼杰尼~",time:"昨天"},
                    {id:"user00002",nickname:"喵喵怪",avatar:avatar3,chatInfo:"喵喵~喵喵喵~喵喵喵喵...",time:"20:57"},
                    {id:"user00000",nickname:"可达鸭可达鸭可达鸭可",avatar:avatar1,chatInfo:"可达可达~",time:"4月21日"},
                    {id:"user00001",nickname:"杰尼龟",avatar:avatar2,chatInfo:"杰尼杰尼~",time:"昨天"},
                    {id:"user00002",nickname:"喵喵怪",avatar:avatar3,chatInfo:"喵喵~喵喵喵~喵喵喵喵...",time:"20:57"},
                    {id:"user00000",nickname:"可达鸭可达鸭可达鸭可",avatar:avatar1,chatInfo:"可达可达~",time:"4月21日"},
                    {id:"user00001",nickname:"杰尼龟",avatar:avatar2,chatInfo:"杰尼杰尼~",time:"昨天"},
                    {id:"user00002",nickname:"喵喵怪",avatar:avatar3,chatInfo:"喵喵~喵喵喵~喵喵喵喵...",time:"20:57"},
                    {id:"user00000",nickname:"可达鸭可达鸭可达鸭可",avatar:avatar1,chatInfo:"可达可达~",time:"4月21日"},
                    {id:"user00001",nickname:"杰尼龟",avatar:avatar2,chatInfo:"杰尼杰尼~",time:"昨天"},
                    {id:"user00002",nickname:"喵喵怪",avatar:avatar3,chatInfo:"喵喵~喵喵喵~喵喵喵喵...",time:"20:57"},
                ],
                friendList:[
                    {nickname:"可达鸭",avatar:avatar1},
                    {nickname:"杰尼龟",avatar:avatar2},
                    {nickname:"喵喵怪",avatar:avatar3},
                    {nickname:"可达鸭",avatar:avatar1},
                    {nickname:"杰尼龟",avatar:avatar2},
                    {nickname:"喵喵怪",avatar:avatar3},
                    {nickname:"可达鸭",avatar:avatar1},
                    {nickname:"杰尼龟",avatar:avatar2},
                    {nickname:"喵喵怪",avatar:avatar3},
                ],
                logo: mango,
                currentUserAvatar: avatar,
                currentUserNickname: "unknown",
                isInit:true,
                isShowChat:true,
                isShowFriend:false,
                showSetting:false,
                showChatArea:false,
                chattingFriendNickname:"",
                chattingFriendAvatar:"",
                chattingInfo:[],
            }

        },
        computed:{
            currentUser(){
                this.$store.commit('setUser',window.localStorage.getItem("username"));
                return this.$store.state.username;
            },
         },
        methods:{
            showChat(){
                this.isShowChat = true;
                this.isShowFriend = false;
                this.showSetting = false;
                console.log("showChat");
            },
            showInfo(){
                this.showSetting = true;
                console.log("showInfo");
            },
            showFriend(){
                this.isShowChat = false;
                this.isShowFriend = true;
                this.showSetting = false;
                console.log("showFriend");
            },
            logout(){
                this.$axios.get("/logout").then(()=>{
                    console.log("已注销");
                    window.localStorage.removeItem("username");
                    window.location.href="login";
                }).catch((error)=>{
                    console.log(error.response);
                })
            },
            closeSetting(){
                this.showSetting=false;
            },
            toChat(id,nickname,time,chatInfo,avatar){
                this.isInit = false;
                this.showChatArea = true;
                this.chattingInfo=[
                    {isFriend:true,chatInfo:chatInfo,time:time},
                    {isFriend:false,chatInfo:chatInfo,time:time},
                    {isFriend:true,chatInfo:chatInfo,time:time},
                    {isFriend:true,chatInfo:chatInfo,time:time},
                    {isFriend:true,chatInfo:chatInfo,time:time},
                    {isFriend:true,chatInfo:chatInfo,time:time},
                    {isFriend:false,chatInfo:chatInfo,time:time},
                    {isFriend:true,chatInfo:chatInfo,time:time},
                    {isFriend:true,chatInfo:chatInfo,time:time},
                    {isFriend:true,chatInfo:chatInfo,time:time},
                ]
                this.chattingFriendNickname = nickname;
                this.chattingFriendAvatar = avatar;
                console.log(id);
                console.log(nickname);
                console.log(time);
                console.log(chatInfo);
                console.log(avatar);
            }
        },
    };
</script>
<style lang="css" scoped>
    .Home,#container,#aside,#main,#chat,#friend{
        height: 100vh;
    }
    #aside{
        width:5% !important;
    }
    #chat,#friend{
        width: 24% !important;
    }
    #main{
        padding: unset;
    }
    #init{
        height: inherit;
        background-color:#ffffffdb;
    }
    .chatArea{
        height: inherit;
        background-color:#ffffffdb;
    }
    .logo{
        height:250px;
        width: 200px;
        opacity: 10%;
        position: relative;
        top:50%;
        margin-top: -125px;
    }

</style>
