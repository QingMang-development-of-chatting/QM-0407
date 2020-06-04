//聊天主页组件
<template>
    <div class="Home">
        <el-container id="container" >
            <el-aside id="aside">
                <sidebar :avatar-url="currentUser.avatar" :get-new-friend="untreatedApplyNum>0" :loading-avatar="loadingAvatar" @showInfo="showInfo" @showChat="showChat" @showFriend="showFriend" @logout="logout"></sidebar>
            </el-aside>
            <el-aside id="chat" v-show="isShowChat">
                <chatbar :chatList="chatList" @toChat="toChat" :loading-chat-bar="loadingChatBar"></chatbar>
            </el-aside>
            <el-aside id="friend" v-show="isShowFriend">
                <friendbar :NewApplyNumber="untreatedApplyNum" :friendList="chatList" @showAdd ="toAdd" @showFriend="toFriend"></friendbar>
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
    import default_avatar from '../../assets/default.jpg'
    import sidebar from "../../components/sidebar/sidebar";
    import chatbar from "../../components/chatbar/chatbar";
    import Friendbar from "../../components/friendbar/friendbar";
    import SettingWindow from "../../components/settingWindow/settingWindow";
    import ChatArea from "../../components/chatArea/chatArea";
    import friendInfo from "../../components/friendInfo/friendInfo";
    import AddFriend from "../../components/addFriend/addFriend";
    let Base64 = require('js-base64').Base64;
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
            //申请信息表
            applyMessages(){
                return this.$store.state.applyList.data;
            },
            //未处理申请数目
            untreatedApplyNum(){
                return this.$store.getters['applyList/getUntreatedNum'];
            },
        },
        methods:{
            //初始化界面
            async init(){
                //获取当前用户ID,判断是否已登录
                let id = window.localStorage.getItem("username");
                if(id == null)
                {
                    alert("请先登录");
                    await this.$router.push({name: 'Login'}); //用户未登录跳转至登录页
                }
                else{
                    let password = window.localStorage.getItem("password");
                    let decode_id = Base64.decode(id);
                    let decode_password = Base64.decode(password);
                    id = decode_id.substr(3);
                    password = decode_password.substr(4);
                    await this.$socket.emit('userLogin',id,password,
                        (result)=>{
                        console.log("登录接口返回:",result);
                        if(result.status === 2)
                        {
                            console.log("登录成功");
                        }
                        else if(result.status === 1)
                        {
                            if(result.reason === 0 || result.reason === 1){
                                this.$message({message:"登录信息已过期",type:"warning",duration:1000});
                                window.localStorage.removeItem("username");
                                window.localStorage.removeItem("password");
                                setTimeout(()=>{
                                    this.$router.push("/Login");
                                },1000);
                            }
                            else
                                console.log("重复登录");
                        }
                            else if(result.status === 0)
                            {
                                this.$message({message:"请求参数错误",type:"error",duration:800});
                                setTimeout(()=>{
                                    this.$router.push("/Login");
                                },800);
                            }
                            else
                            {
                                this.$message({message:"服务器无响应",type:"warning",duration:800});
                                window.localStorage.removeItem("username");
                                window.localStorage.removeItem("password");
                                setTimeout(()=>{
                                    this.$router.push("/Login");
                                },800);
                            }
                    });
                }
                //初始化
                //此处应调用接口获取当前用户资料
                let nickname;
                let avatar;
                await this.$axios.get('v1/userinfo/'+id)
                    .then((result)=>{
                        console.log("用户资料返回",result);
                        avatar = result.data.photo;
                        nickname = result.data.nickname;
                        if (avatar === "")  //用户未设置过头像，采用默认头像
                            avatar = default_avatar;
                        this.$store.commit('currentUser/setUser',{id:id,nickname:nickname,avatar:avatar});
                        this.loadingAvatar = false;
                        // console.log(this.$store.state.currentUser.id);
                    })
                    .catch((error)=>{
                        this.$message({message:'服务器响应错误',type:"warning",duration:800});
                        console.log('获取用户资料时，服务器响应错误:',error.response);
                        this.loadingAvatar = false;
                    });
                //获取好友列表
                //此处调用接口初始化好友列表
                await this.$axios.get('v1/friend/'+id)
                    .then(async(result)=> {
                        console.log("好友列表返回",result);
                        let friendInfo ={};
                        for(let i =0;i<result.data.length;i++)
                            await this.$axios.get('v1/userinfo/'+result.data[i])
                                .then((response)=>{
                                    console.log("好友资料返回",i,response);
                                    let avatar = response.data.photo;
                                    if(avatar === "")
                                        avatar = default_avatar;
                                    friendInfo[response.data.username] = {
                                        nickname:response.data.nickname,
                                        avatar:avatar,
                                        newInfo:false,
                                        unread_num:0,
                                        recentMessage:{}
                                    };
                            })
                                .catch((error)=>{
                                    console.log("获取好友资料出错",error.response);
                                });
                        this.$store.commit('friendInfo/addFriendInfo',friendInfo);  //保存好友信息
                        await this.$axios.get('/v1/chat/'+id+"/chatlist")
                            .then((result2)=>{
                                console.log("聊天列表返回",result2);
                                let recentChat = [];
                                for(let i=0; i<result2.data.length;i++)
                                {
                                    let newInfo = false;
                                    if (result2.data[i].sender !== id)
                                        newInfo = true;
                                    let t ={
                                        id:result2.data[i].friend,
                                        newInfo:newInfo,
                                        unread_num:result2.data[i].unread_cnt,
                                        message:result2.data[i].last_txt,
                                        time:result2.data[i].last_time,
                                    };
                                    recentChat.push(t);
                                }
                                this.$store.commit('friendInfo/addRecent',recentChat);  //更新好友信息
                                this.loadingChatBar = false;
                        })
                            .catch((error)=>{
                                console.log("获取聊天列表出错",error.response);
                                this.loadingChatBar = false;
                        });
                            this.loadingChatBar = false;
                    })
                    .catch((error)=>{
                        console.log("获取好友列表时，服务器响应错误:",error);
                        this.loadingChatBar = false;
                    });
                //此处调用接口获取好友申请表
                this.$axios.get('/v1/friend/'+id+'/applicants')
                    .then(async (result)=>{
                        console.log("好友申请返回",result);
                        let applyInfo = [];
                        for(let i = 0;i < result.data.length;i++){
                            if(result.data[i].type === 0||result.data[i].type ===1 || result.data[i].type ===2) {
                                await this.$axios.get('v1/userinfo/' + result.data[i].sender)
                                    .then((result2) => {
                                        console.log("申请者资料返回", result2);
                                        let id = result2.data.username;
                                        let nickname = result2.data.nickname;
                                        let avatar = result2.data.photo;
                                        if(avatar === "")
                                            avatar = default_avatar;
                                        let dispose = 0;
                                        if(result.data[i].type === 1)
                                            dispose = 1;
                                        else if(result2.data.type === 2)
                                            dispose = -1;
                                        let pieceApply = {id:id,nickname:nickname,avatar:avatar,dispose:dispose};
                                        applyInfo.push(pieceApply);
                                    })
                                    .catch((error) => {
                                        console.log("获取申请者资料时出错", error);
                                    })
                            }
                        }
                        this.$store.commit('applyList/set',applyInfo);  //存储好友申请表
                    })
                    .catch((error)=>{
                        console.log("获取好友申请表时出错",error.response);
                })
            },
            //显示聊天界面
            showChat(){
                this.isShowChat = true;
                this.isShowFriend = false;
                this.showSetting = false;
            },
            //显示个人资料
            showInfo(){
                this.showSetting = true;
            },
            //显示好友信息
            showFriend(){
                this.isShowChat = false;
                this.isShowFriend = true;
                this.showSetting = false;
            },
            //注销
            logout(){
                this.$socket.emit('userLogout',
                    (result)=>{
                    console.log("注销返回:",result);
                    if(result.status === 2){
                        window.localStorage.removeItem("username");
                        window.localStorage.removeItem('password');
                        this.$message({message:"已注销,即将跳转至登录页",type:"success",duration:800});
                        setTimeout(()=>{
                            this.$router.push("/Login");
                        },800);
                    }
                    else if(result.status === 1){
                        this.$message({message:"未登录",type:"warning",duration:800});
                        setTimeout(()=>{
                            this.$router.push("/Login");
                        },800);
                    }
                    else{
                        this.$message({message:"服务器未响应",type:"warning",duration:800});
                    }
                });
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
                //此处调用接口修改头像
                reader.onload = () => {
                    let base64Str = reader.result;
                    this.$axios.put('/v1/userinfo/'+this.currentUser.id+'/photo',{
                        photo:base64Str
                    })
                        .then(()=>{
                            this.$store.commit('currentUser/setAvatar',base64Str);
                            this.$message({message:'修改成功',type:'success',duration:800});
                        })
                        .catch((error)=>{
                            this.$message({message:'修改失败',type:'error'});
                            console.log("修改头像返回错误，",error);
                        })
                }
            },
            //修改昵称
            editNickname(nickname){
                //此处需调用接口修改昵称
                this.$axios.put('/v1/userinfo/'+this.currentUser.id+'/nickname', {
                    nickname:nickname
                }).then(()=> {
                    this.$store.commit('currentUser/setNickname', nickname);
                    this.$message({message:'修改成功',type:'success',duration:800});
                }).catch((error)=> {
                    console.log("修改昵称返回错误:",error);
                    this.$message({message:'修改失败,服务器响应错误',type:'warning',duration:800});
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
                this.$socket.emit('friendAccessSend',applyId,
                    (result)=>{
                    console.log("接受好友申请返回",result);
                    if(result.status === 2){
                        this.$store.commit('applyList/accept',applyId); //更新申请列表
                        let friendInfo = this.$store.getters['applyList/getApplyUser'](applyId);
                        let friend = {};
                        friend[applyId]={nickname:friendInfo.nickname,avatar:friendInfo.avatar,newInfo:false,unread_num:0,recentMessage:{}};
                        this.$store.commit('friendInfo/addFriendInfo',friend);  //更新好友列表
                    }
                    else if(result.status === 1)
                        this.$message({message:"服务器拒绝服务",type:"warning"});
                    else
                        this.$message({message:"请求参数错误",type:"error"});
                });
            },
            //拒绝好友添加请求
            rejectApply(applyId){
                //此处需要调用拒绝好友请求接口（参数提供添加者ID，被添加者ID ）
                this.$axios.put('/v1/friend/'+this.currentUser.id+'/applicants/reject/'+applyId)
                    .then((result)=>{
                        console.log("拒绝好友申请返回",result);
                        this.$message({message:"已拒绝",type:"success",duration:800});
                        this.$store.commit('applyList/reject',applyId); //更新申请列表
                    })
                    .catch((error)=>{
                        console.log("拒绝申请返回出错,",error.response);
                        if(error.response.status === 408)
                            this.$message({message:"申请者不存在",type:"warning"});
                        else if(error.response.status === 400)
                            this.$message({message:"请求参数错误",type:"error"});
                        else
                            this.$message({message:"服务器无响应",type:"error"});
                    });
            },
            //查找用户
            searchUser(id){
                if (id==="")
                    this.$message({message:"账号不能为空",type:'warning',duration:800});
                else if(id.length<3)
                    this.$message({message:'输入账号过短',type:'warning',duration:800});
                else{
                    this.searchLoading = true;
                    //此处调用接口查找用户
                    this.$axios.get('v1/userinfo/'+id)
                        .then((result)=>{
                            this.searchLoading = false;
                            this.showFoundRemind = false;
                            this.foundUser["id"] = result.data.username;
                            this.foundUser["nickname"] = result.data.nickname;
                            let avatar = result.data.photo;
                            if(avatar==="")
                                avatar = default_avatar;   //未设置头像显示默认头像
                            this.foundUser["avatar"] = avatar;
                            this.showFound = true;
                        })
                        .catch((error)=>{
                            this.searchLoading = false;
                            console.log("查找用户返回错误:",error.response);
                            if(error.response.status === 404){
                                this.showFound = false;
                                this.showFoundRemind = true;
                            }
                            else
                                this.$message({message:'服务器响应错误',type:'warning',duration:800});
                        })
                }


            },
            //发送添加好友请求
            sendAddFriend(id){
                ///console.log(id);
                //此处需要调用发送好友请求接口（提供添加者ID、昵称以及被添加者ID参数）
                console.log(this.$store.getters['friendInfo/getFriend'](id));
                if(id === this.currentUser.id)
                    this.$message({message:'不可添加自己为好友',type:'warning',duration:800});
                else if(this.$store.getters['friendInfo/getFriend'](id) === undefined)
                    this.$socket.emit('friendApplySend',id,
                        (result)=>{
                        console.log("发送好友请求返回",result);
                        if (result.status === 2)
                            this.$message({message:"已发送",type:"success",duration:800});
                        else
                            this.$message({message:"发送失败,服务器响应错误",type:"error",duration:800});
                    });
                else
                    this.$message({message:'该用户已在您的好友列表中',type:'warning',duration:800});
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
            },
        },
        sockets: {
            //用户强制登出事件
            userLogout(){
                this.$message({message:"您的账号已在其他地方登录,即将登出",type:"warning",duration:2000});
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
                setTimeout(()=>{
                    this.$router.push("/Login");
                },2000);
            },
            //收到好友申请
            friendApplyRece(requester){
                this.$message({message:'收到新好友申请:'+requester,type:"info",duration:1000});
                this.$axios.get('v1/userinfo/'+requester).then(
                    (result)=>{
                        let avatar = result.data.photo;
                        let nickname = result.data.nickname;
                        let id = result.data.username;
                        if(avatar ==="")
                            avatar = default_avatar;
                        let newApply ={id:id,nickname:nickname,avatar:avatar,dispose:0};
                        this.$store.commit('applyList/add',newApply);
                }).catch((error)=>{
                    console.log("获取申请者资料更新申请表时出错,",error);
                })
            },
            //好友申请反馈事件
            friendAccessdRece(response){
                console.log("好友申请反馈",response);
                this.$message({message:response+"通过了你的好友请求",type:"info",duration:800});
                let avatar,nickname;
                this.$axios.get('v1/userinfo/'+response)
                    .then((result)=>{
                        console.log("好友资料返回",result);
                        avatar = result.data.photo;
                        nickname = result.data.nickname;
                        if (avatar === "")  //用户未设置过头像，采用默认头像
                            avatar = default_avatar;
                        // console.log(this.$store.state.currentUser.id);
                        let friend = {};
                        friend[response]={nickname:nickname,avatar:avatar,newInfo:false,unread_num:0,recentMessage:{}};
                        this.$store.commit('friendInfo/addFriendInfo',friend);  //更新好友列表
                    })
                    .catch((error)=>{
                        this.$message({message:'服务器响应错误',type:"warning",duration:800});
                        console.log('处理申请反馈时，服务器响应错误:',error.response);
                    });
            },
            disconnect(){
                this.$message({message:"服务器已断开连接",type:"error",duration:800});
            },
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
