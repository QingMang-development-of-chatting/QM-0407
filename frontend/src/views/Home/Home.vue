//聊天主页组件
<template>
    <div class="Home">
        <el-container id="container" >
            <el-aside id="aside">
                <sidebar :avatar-url="currentUser.avatar" @showInfo="showInfo" @showChat="showChat" @showFriend="showFriend" @logout="logout"></sidebar>
            </el-aside>
            <el-aside id="chat" v-show="isShowChat">
                <chatbar :chatList="chatList" @toChat="toChat" ></chatbar>
            </el-aside>
            <el-aside id="friend" v-show="isShowFriend">
                <friendbar :friendList="chatList" @showAdd ="toAdd" @showFriend="toFriend"></friendbar>
            </el-aside>
            <el-main id="main">
                <div id="init" v-if="isInit">
                    <img class ="logo" :src="logo"  alt="logo">
                </div>
                <chat-area v-if="showChatArea" :friend-nickname="chattingFriendNickname" :friend-avatar="chattingFriendAvatar" :my-avatar="currentUser.avatar" :chatting-info="chatInfo[chattingFriendID]" :friendID="chattingFriendID" @sendMessage="sendMessage"></chat-area>
                <friend-info v-if="showFriendInfo"></friend-info>
                <add-friend v-if="showAddFriend" :apply-messages="applyMessages" :found-user="foundUser" :show-found="showFound" @accept="acceptApply" @reject="rejectApply" @addFriend="sendAddFriend" @searchUser="searchUser"></add-friend>
            </el-main>
        </el-container>
        <setting-window v-if="showSetting" :id="currentUser.id" :nickname="currentUser.nickname" :avatar-url="currentUser.avatar" @closeInfo="closeSetting" @changeAvatar="editAvatar" @changeNickname="editNickname"></setting-window>
    </div>
</template>

<script>
    import mango from '../../assets/mango.png'
    import avatar from '../../assets/default.jpg'
    import avatar1 from '../../assets/可达鸭.jpeg'
    import avatar2 from '../../assets/杰尼龟.jpeg'
    import avatar3 from '../../assets/喵喵怪.jpg'
    import avatar4 from '../../assets/陌生人.jpg'
    import sidebar from "../../components/sidebar/sidebar";
    import chatbar from "../../components/chatbar/chatbar";
    import Friendbar from "../../components/friendbar/friendbar";
    import SettingWindow from "../../components/settingWindow/settingWindow";
    import ChatArea from "../../components/chatArea/chatArea";
    import friendInfo from "../../components/friendInfo/friendInfo";
    import AddFriend from "../../components/addFriend/addFriend";
    export default {
        name: "home",
        components: {
            AddFriend,
            sidebar,    //主侧边栏组件
            SettingWindow,  //个人资料设置组件
            Friendbar,  //好友资料侧边栏组件
            chatbar, //聊天侧边栏组件
            ChatArea,   //聊天对话框组件
            friendInfo, //好友资料组件
        },
        created() {
            //获取当前用户ID,判断是否已登录
            let id = window.localStorage.getItem("username");
            if(id == null)
            {
                alert("请先登录");
                window.location.href = "login";
            }
            //初始化
            //此处应调用接口获取当前用户资料
            this.$store.commit('currentUser/setUser',{id:id,nickname:"测试用户",avatar:avatar});
            //此处应调用接口获取好友列表
            //此处应调用接口获取好友资料
            let temp = {
                'user00000':{nickname:'可达鸭',avatar:avatar1,recentMessage:{message:"可达可达~",time:"5月1日"}},
                'user00001':{nickname:'杰尼龟',avatar:avatar2,recentMessage:{message:"杰尼杰尼~",time:"15:51"}},
                'user00002':{nickname:'喵喵怪',avatar:avatar3,recentMessage:{message:"喵喵喵喵~",time:"昨天"}},
                'user00003':{nickname:'可达鸭可达鸭',avatar:avatar1,recentMessage:{message:"可达可达~可达可达~",time:"5月1日"}},
                'user00004':{nickname:'杰尼龟杰尼龟',avatar:avatar2,recentMessage:{message:"杰尼杰尼~杰尼杰尼~",time:"5月1日"}},
                'user00005':{nickname:'喵喵怪喵喵怪',avatar:avatar3,recentMessage:{message:"喵喵喵喵~喵喵喵喵~",time:"5月1日"}},
                'user00006':{nickname:'可达鸭可达鸭可达鸭可',avatar:avatar1,recentMessage:{message:"可达可达~可达可达~可达可达~",time:"5月1日"}},
                'user00007':{nickname:'杰尼龟杰尼龟杰尼龟杰',avatar:avatar2,recentMessage:{message:"杰尼杰尼~杰尼杰尼~杰尼杰尼~",time:"5月1日"}},
                'user00008':{nickname:'喵喵怪喵喵怪喵喵怪喵',avatar:avatar3,recentMessage:{message:"喵喵喵喵~喵喵喵喵~喵喵喵喵~",time:"5月1日"}},
            };
            // this.$store.dispatch('friendInfo/addFriendInfos',temp);
            this.$store.commit('friendInfo/addFriendInfo', temp);   //存储好友信息
            // console.log(this.$store.state.friendInfo.friendInfoDic['user00001']);
            //此处应调用接口获取好友申请表
            let temp2 =[
                {id:'user00000',nickname:"可达鸭",avatar:avatar1,dispose:1},
                {id:'user0000x',nickname:"陌生人",avatar:avatar4,dispose:0},
                {id:'user00000',nickname:"可达鸭",avatar:avatar1,dispose:-1},
                {id:'user00001',nickname:"杰尼龟",avatar:avatar2,dispose:1},
                {id:'user00002',nickname:"喵喵怪",avatar:avatar3,dispose:1},
            ];
            this.$store.commit('applyList/set',temp2);  //存储好友申请表

        },
        data(){
            return{
                //初始化图标url
                logo: mango,
                //是否初始化
                isInit:true,
                //是否展示聊天侧边栏
                isShowChat:true,
                //是否展示好友资料侧边栏
                isShowFriend:false,
                //是否展示个人资料设置
                showSetting:false,
                //是否展示聊天对话框
                showChatArea:false,
                //是否显示添加好友窗口
                showAddFriend:false,
                //是否显示查找到的用户
                showFound:false,
                //添加好友窗口查找到的用户
                foundUser:{},
                //是否展示好友资料
                showFriendInfo:false,
                //聊天对话框好友ID
                chattingFriendID:"",
                //聊天对话框好友昵称
                chattingFriendNickname:"",
                //聊天对话框好友头像
                chattingFriendAvatar:"",

            }
        },
        computed:{
            //当前用户ID
            currentUser(){
                return this.$store.state.currentUser;
            },
            //聊天列表
            chatList(){
                return this.$store.state.friendInfo.friendInfoDic;
            },
            //聊天记录表
            chatInfo(){
                return this.$store.state.chatInfo.chatMessages;
            },
            applyMessages(){
                return this.$store.state.applyList.data;
            }
         },
        methods:{
            //显示聊天界面
            showChat(){
                this.isShowChat = true;
                this.isShowFriend = false;
                this.showSetting = false;
                // console.log(this.chatList["user00001"]);
                //console.log("showChat");
            },
            //显示个人资料
            showInfo(){
                this.showSetting = true;
                //console.log("showInfo");
            },
            //显示好友信息
            showFriend(){
                this.isShowChat = false;
                this.isShowFriend = true;
                this.showSetting = false;
            },
            //注销
            logout(){
                this.$axios.get("/logout").then(()=>{
                    //console.log("已注销");
                    //this.$socket.emit("v1/leave room",this.currentUser);
                    window.localStorage.removeItem("username");
                    window.location.href="login";
                }).catch((error)=>{
                    console.log(error.response);
                })

            },
            //隐藏个人资料
            closeSetting(){
                this.showSetting=false;
            },
            //修改头像
            editAvatar(file){
                console.log(file[0]);
                //此处需调用接口修改头像
                this.$store.commit('currentUser/setAvatar',window.URL.createObjectURL(file[0].raw));
                // this.currentUserAvatar = window.URL.createObjectURL(file[0].raw);
            },
            //修改昵称
            editNickname(nickname){
                //此处需调用接口修改昵称
                console.log(nickname);
                this.$store.commit('currentUser/setNickname', nickname);
            },
            //载入好友聊天对话框
            toChat(id,nickname,avatar){
                this.isInit = false;
                this.showFriendInfo = false;
                this.showAddFriend = false;
                this.showChatArea = false;
                this.showChatArea = true;
                this.chattingFriendNickname = nickname;
                this.chattingFriendAvatar = avatar;
                this.chattingFriendID = id;
                //此处应调用接口获取与该好友聊天记录,并将数据存入store
                let temp ={
                    "user00000":[
                        {message:"可达~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"可达可达~",isFriend:true,isRead:true,time:"5月1日"},
                        {message:"可达可达可达~",isFriend:true,isRead:true,time:"5月1日"},
                        {message:"可达可达可达可达~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"可达可达可达可达可达~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"可达可达可达可达可达可达~",isFriend:true,isRead:true,time:"5月1日"},
                        {message:"可达可达~",isFriend:true,isRead:true,time:"5月1日"},
                    ],
                    "user00001":[
                        {message:"杰尼杰尼~",isFriend:true,isRead:true,time:"15:51"},
                    ],
                    "user00002":[
                        {message:"喵喵喵喵~",isFriend:true,isRead:true,time:"昨天"},
                    ],
                    "user00003":[
                        {message:"可达可达可达~",isFriend:true,isRead:true,time:"5月1日"},
                    ],
                    "user00004":[
                        {message:"杰尼~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"杰尼杰尼~",isFriend:true,isRead:true,time:"5月1日"},
                    ],
                    "user00005":[
                        {message:"喵~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"喵喵喵喵~",isFriend:true,isRead:true,time:"5月1日"},
                        {message:"喵喵喵喵喵喵~",isFriend:true,isRead:true,time:"5月1日"},
                    ],
                    "user00006":[
                        {message:"可达~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"可达可达可达可达~",isFriend:true,isRead:true,time:"5月1日"},
                    ],
                    "user00007":[
                        {message:"杰尼~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"杰尼杰尼杰尼杰尼~",isFriend:true,isRead:true,time:"5月1日"},
                    ],
                    "user00008":[
                        {message:"喵喵~",isFriend:false,isRead:true,time:"5月1日"},
                        {message:"喵喵喵喵喵喵~",isFriend:true,isRead:true,time:"5月1日"},
                    ],
                };
                this.$store.commit('chatInfo/addChatInfo',temp);
                // console.log(this.chatInfo[this.chattingFriendID]);
            },
            //载入添加好友窗口
            toAdd(){
                this.isInit = false;
                this.showFriendInfo = false;
                this.showChatArea = false;
                this.showAddFriend = true;
            },
            //接受好友添加请求
            acceptApply(applyId){
                //此处需要调用接受好友请求接口（参数提供添加者ID，被添加者ID ）
                this.$store.commit('applyList/accept',applyId); //更新申请列表
                //此处需调用接口获取新增加好友资料（参数提供id）
                let friend={applyId:{nickname:"陌生人",avatar:avatar4,recentMessage:{}}};
                this.$store.commit('friendInfo/addFriendInfo',friend);
                console.log(this.$store.state.friendInfo.friendInfoDic);
            },
            //拒绝好友添加请求
            rejectApply(applyId){
                //此处需要调用拒绝好友请求接口（参数提供添加者ID，被添加者ID ）
                this.$store.commit('applyList/reject',applyId); //更新申请列表
            },
            //查找用户
            searchUser(id){
                //此处应调用接口查找用户
                this.foundUser["id"] = id;
                this.foundUser["nickname"] = "陌生人";
                this.foundUser["avatar"] = avatar4;
                this.showFound = true;
            },
            //发送添加好友请求
            sendAddFriend(id){
                console.log(id);
                //此处需要调用发送好友请求接口（提供添加者ID、昵称以及被添加者ID参数）

            },
            //载入好友资料
            toFriend(){
                this.isInit = false;
                this.showAddFriend = false;
                this.showChatArea = false;
                this.showFriendInfo = true;

            },
            //发送消息
            sendMessage(message){
                // this.$socket.emit("v1.1/message",this.currentUser,  { sender: this.currentUserNickname, text: message});
                // console.log("已发送");
                let date = new Date();
                let time = date.getFullYear()+'-'+(date.getMonth()+1).toString()+'-'+date.getDay().toString()+'-'+date.getHours().toString()+'-'+date.getMinutes();
                // console.log(time);
                let info =  {id:this.chattingFriendID,message:{message:message,isFriend:false,isRead:false,time:time}};
                this.$store.commit('chatInfo/sendUpdate',info);
            }
        },
        // sockets:{
        //     connect() {
        //         console.log("链接成功");
        //         this.$socket.emit("v1/join room",this.currentUser);
        //     },
        //     disconnect(){
        //         console.log("断开链接");
        //         this.$socket.emit("v1/leave room",this.currentUser);
        //     },//检测socket断开链接
        //     reconnect(){
        //         console.log("重新链接");
        //     },
        // }
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
    .chatArea,.friendInfo,.addFriend{
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
