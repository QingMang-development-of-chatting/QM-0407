//聊天主页组件
<template>
    <div class="Home">
        <el-container id="container" >
            <el-aside id="aside">
                <sidebar :avatar-url="currentUser.avatar" :loading-avatar="loadingAvatar" @showInfo="showInfo" @showChat="showChat" @showFriend="showFriend" @logout="logout"></sidebar>
            </el-aside>
            <el-aside id="chat" v-show="isShowChat">
                <chatbar :chatList="chatList" @toChat="toChat" :loading-chat-bar="loadingChatBar"></chatbar>
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
                <add-friend v-if="showAddFriend" :loading="searchLoading" :apply-messages="applyMessages" :found-user="foundUser" :show-found="showFound" :showFoundRemind='showFoundRemind' @accept="acceptApply" @reject="rejectApply" @addFriend="sendAddFriend" @searchUser="searchUser"></add-friend>
            </el-main>
        </el-container>
        <setting-window v-if="showSetting" :id="currentUser.id" :nickname="currentUser.nickname" :avatar-url="currentUser.avatar"  @closeInfo="closeSetting" @changeAvatar="editAvatar" @changeNickname="editNickname"></setting-window>
    </div>
</template>

<script>
    import mango from '../../assets/mango.png'
    import avatar0 from '../../assets/default.jpg'
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
            AddFriend,  //条件好友组件
            sidebar,    //主侧边栏组件
            SettingWindow,  //个人资料设置组件
            Friendbar,  //好友资料侧边栏组件
            chatbar, //聊天侧边栏组件
            ChatArea,   //聊天对话框组件
            friendInfo, //好友资料组件
        },
        created() {
            this.init();
        },
        data(){
            return{
                //初始化图标url
                logo: mango,
                //是否初始化
                isInit:true,
                //是否正在加载头像
                loadingAvatar: true,
                //是否正在加载聊天列表
                loadingChatBar:true,
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
                //是否正在查找
                searchLoading:false,
                //是否显示查找到的用户
                showFound:false,
                //添加好友窗口查找到的用户
                foundUser:{},
                //是否显示查找结果文本
                showFoundRemind:false,
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
            //初始化界面
            async init(){
                //获取当前用户ID,判断是否已登录
                let id = window.localStorage.getItem("username");
                if(id == null)
                {
                    alert("请先登录");
                    window.location.href = "login"; //用户未登录跳转至登录页
                }
                //初始化
                //此处应调用接口获取当前用户资料
                let nickname;
                let avatar;
                await this.$axios.post('userinfo', {users:[id]})
                    .then((result)=>{
                        console.log("用户资料返回",result);
                        avatar = result.data[0].user_photo;
                        nickname = result.data[0].user_name;
                        if (avatar == 0)  //用户未设置过头像，采用默认头像
                            avatar = avatar0;
                        this.$store.commit('currentUser/setUser',{id:id,nickname:nickname,avatar:avatar});
                        this.loadingAvatar = false;
                    })
                    .catch((error)=>{
                        this.$message({message:'服务器响应错误',type:"warning"});
                        console.log('获取用户资料时，服务器响应错误:'+error);
                        this.loadingAvatar = false;
                    });
                //获取好友列表
                //此处调用接口初始化好友列表
                await this.$axios.get('/friends/'+id)
                    .then(async(result)=> {
                        console.log("好友列表返回",result);
                        await this.$axios.post('userinfo',{users:result.data})
                            .then((response)=>{
                                console.log("好友资料返回",response);
                                let friendInfo={};
                                for (let i = 0; i < response.data.length; i++)
                                {
                                    let avatar = response.data[i].user_photo;
                                    if(avatar == 0)
                                        avatar = avatar0;   //好友未设置头像，显示默认头像
                                    friendInfo[response.data[i].user_id] = {nickname:response.data[i].user_name,avatar:avatar,recentMessage:{},newInfo:false};
                                }
                                // console.log(friendInfo);
                                this.$store.commit('friendInfo/addFriendInfo', friendInfo);
                                //此处应调用接口获取最近聊天信息用于初始化聊天列表
                                //设置模拟接口返回数据
                                let rencentChat = [
                                    {id:"user00",message:"可达可达？",time:"5月1日",newInfo:true},
                                    {id:"user01",message:"没干啥",time:"19：49",newInfo:false},
                                    {id:"user02",message:"就是这样~喵~~~~",time:"昨天",newInfo:true}
                                ];
                                this.$store.commit('friendInfo/addRecent',rencentChat);     // 更新最近聊天信息
                                this.loadingChatBar = false;
                                // console.log(this.$store.state.friendInfo.friendInfoDic['user00']);
                                // this.$store.commit('friendInfo/addFriendInfo', temp);
                            })
                            .catch((error)=>{
                                console.log("获取好友资料时，服务器响应错误:",error);
                                this.loadingChatBar = false;
                            });
                    })
                    .catch((error)=>{
                        console.log("获取好友列表时，服务器响应错误:",error);
                        this.loadingChatBar = false;
                    });
                //此处应调用接口获取好友申请表
                this.$axios.get('/notifications/'+id)
                    .then((result)=>{
                        console.log("好友申请返回",result);
                        let applyUsers = [];
                        for(let i = 0;i < result.data.length;i++)
                            applyUsers.push(result.data[i].applicant);
                        console.log(applyUsers);
                        this.$axios.post('userinfo', {users:applyUsers})
                            .then((response)=>{
                                console.log("返回申请者资料",response);
                                let applyInfo=[];
                                for(let i=0;i<response.data.length;i++)
                                {
                                    let id = response.data[i].user_id;
                                    let nickname = response.data[i].user_name;
                                    let avatar = response.data[i].user_photo;
                                    let dispose = result.data[i].answer;
                                    if (avatar == 0)
                                        avatar = avatar0;
                                    applyInfo.push({id:id,nickname:nickname,avatar:avatar,dispose:dispose});
                                }
                                this.$store.commit('applyList/set',applyInfo);  //存储好友申请表
                            })
                            .catch((error)=>{
                                console.log("获取申请者资料时出错",error);
                        });
                    })
                    .catch((error)=>{
                        console.log(error);
                    });
                // let temp2 =[
                //     {id:'user00000',nickname:"可达鸭",avatar:avatar1,dispose:1},
                //     {id:'user0000x',nickname:"陌生人",avatar:avatar4,dispose:0},
                //     {id:'user00000',nickname:"可达鸭",avatar:avatar1,dispose:-1},
                //     {id:'user00001',nickname:"杰尼龟",avatar:avatar2,dispose:1},
                //     {id:'user00002',nickname:"喵喵怪",avatar:avatar3,dispose:1},
                // ];
                // this.$store.commit('applyList/set',temp2);  //存储好友申请表

            },
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
                this.$axios.get("/logout")
                    .then(()=>{
                        //console.log("已注销");
                        //this.$socket.emit("v1/leave room",this.currentUser);
                        window.localStorage.removeItem("username");
                        window.location.href="login";
                    })
                    .catch((error)=>{
                        console.log(error.response);
                    })

            },
            //隐藏个人资料
            closeSetting(){
                this.showSetting=false;
            },
            //修改头像
            editAvatar(file){
                let img = file.file;
                let reader = new FileReader();
                if(img){
                    reader.readAsDataURL(img);
                }
                reader.onload = () => {
                    // let base64Str = reader.result.split(',')[1];
                    let base64Str = reader.result;
                    // console.log(reader.result);
                    this.$axios.put('/userinfo/photo',{
                        username:this.currentUser.id,
                        photo:base64Str
                    })
                        .then(()=>{
                            this.$store.commit('currentUser/setAvatar',base64Str);
                            this.$message({message:'修改成功',type:'success',duration:800});
                        })
                        .catch(()=>{
                            this.$message({message:'修改失败',type:'error'});
                        })
                }
                //此处需调用接口修改头像

                // this.$store.commit('currentUser/setAvatar',window.URL.createObjectURL(file[0].raw));
                // this.currentUserAvatar = window.URL.createObjectURL(file[0].raw);
            },
            //修改昵称
            editNickname(nickname){
                //此处需调用接口修改昵称
                console.log(nickname);
                this.$axios.put('/userinfo/nickname', {
                    username:this.currentUser.id, nickname:nickname
                }).then(()=> {
                    this.$store.commit('currentUser/setNickname', nickname);
                    this.$message({message:'修改成功',type:'success',duration:800});
                }).catch((error)=> {
                    console.log(error);
                    this.$message({message:'修改失败,服务器响应错误',type:'warning'});
                })
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
                //初次载入时，应调用接口向后台获取与该好友聊天记录,并将数据存入store，后续更新store即可
                //console.log(this.chatInfo[id]);
                if(this.chatInfo[id]===undefined){
                    let temp ={
                        "user00":[
                            {message:"可达",isFriend:true,isRead:true,time:"5月1日"},
                            {message:"可达可达",isFriend:true,isRead:true,time:"5月1日"},
                            {message:"可达可达可达",isFriend:true,isRead:true,time:"5月1日"},
                            {message:"可达可达可达可达",isFriend:true,isRead:true,time:"5月1日"},
                            {message:"🦆\n🦆🦆\n🦆🦆🦆\n🦆🦆🦆🦆",isFriend:true,isRead:true,time:"5月1日"},
                            {message:"？？？",isFriend:false,isRead:true,time:"5月1日"},
                            {message:"可达可达？",isFriend:true,isRead:true,time:"5月1日"},
                        ],
                        "user01":[
                            {message:"Baby baby baby baby O baby baby o baby 是不是拥有以后 就会开始要失去 给你的越多 你却越想要躲 爱已无法回答所有的问题",isFriend:true,isRead:true,time:"19:48"},
                            {message:"离开你是傻  是对是错  是看破是软弱  这结果是爱是恨  或者是什么",isFriend:false,isRead:true,time:"19:48"},
                            {message:"最爱你的人是我  你怎么舍得我难过  对你付出了这么多  你却没有感动过",isFriend:true,isRead:true,time:"19:49"},
                            {message:"爱我别走  如果你说你不爱我  不要听见你真的说出口  再给我一点温柔",isFriend:false,isRead:true,time:"19:48"},
                            {message:"干啥呢？",isFriend:false,isRead:true,time:"19:48"},
                            {message:"没干啥",isFriend:true,isRead:true,time:"19:49"},
                        ],
                        "user02":[
                            {message:"在？",isFriend:true,isRead:true,time:"昨天"},
                            {message:"既然你诚心诚意的发问了",isFriend:false,isRead:true,time:"昨天"},
                            {message:"我们就大发慈悲的告诉你! ",isFriend:true,isRead:true,time:"昨天"},
                            {message:"为了防止世界被破坏 ",isFriend:false,isRead:true,time:"昨天"},
                            {message:"为了守护世界的和平",isFriend:true,isRead:true,time:"昨天"},
                            {message:"贯彻爱与真实的邪恶",isFriend:false,isRead:true,time:"昨天"},
                            {message:"可爱又迷人的反派角色~~",isFriend:true,isRead:true,time:"昨天"},
                            {message:"武藏！",isFriend:false,isRead:true,time:"昨天"},
                            {message:"小次郎！",isFriend:true,isRead:true,time:"昨天"},
                            {message:"我们是穿梭在银河的火箭队！白洞，白色的明天在等着我们！！",isFriend:false,isRead:true,time:"昨天"},
                            {message:"就是这样~喵~~~~",isFriend:true,isRead:true,time:"昨天"},
                        ],
                    };
                    let chatHistory = {};
                    chatHistory[id] = temp[id];
                    console.log(chatHistory);
                    this.$store.commit('chatInfo/addChatInfo',chatHistory);
                }
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
                let friendInfo = this.$store.getters['applyList/getApplyUser'](applyId);
                let friend={applyId:{nickname:friendInfo.nickname,avatar:friendInfo.avatar,recentMessage:{},newInfo:false}};
                this.$store.commit('friendInfo/addFriendInfo',friend);
                //console.log(this.$store.state.friendInfo.friendInfoDic);
            },
            //拒绝好友添加请求
            rejectApply(applyId){
                //此处需要调用拒绝好友请求接口（参数提供添加者ID，被添加者ID ）
                this.$store.commit('applyList/reject',applyId); //更新申请列表
            },
            //查找用户
            searchUser(id){
                if (id==="")
                    this.$message({message:"账号不能为空",type:'warning',duration:800});
                else if(id.length<4)
                    this.$message({message:'输入账号过短',type:'warning',duration:800});
                else{
                    this.searchLoading = true;
                    //此处调用接口查找用户
                    this.$axios.post('userinfo', {users:[id]})
                        .then((result)=>{
                            this.searchLoading = false;
                            if(result.data[0]==null) {
                                this.showFound = false;
                                this.showFoundRemind = true;
                            }
                            else{
                                this.showFoundRemind = false;
                                this.foundUser["id"] = result.data[0].user_id;
                                this.foundUser["nickname"] = result.data[0].user_name;
                                let avatar = result.data[0].user_photo;
                                if(avatar===0)
                                    avatar = avatar0;   //未设置头像显示默认头像
                                console.log(avatar);
                                this.foundUser["avatar"] = avatar;
                                this.showFound = true;
                            }
                        })
                        .catch((error)=>{
                            this.searchLoading = false;
                            this.$message({message:'服务器响应错误',type:'warning'});
                            console.log(error);
                        })
                }


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
