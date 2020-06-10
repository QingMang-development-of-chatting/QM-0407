//聊天主页组件
<template>
    <div class="Home">
        <el-container id="container" >
            <el-aside id="aside">
                <sidebar :avatar-url="currentUser.avatar" :get-new-friend="untreatedApplyNum>0" :unread-message-num="unreadMessageNum" :loading-avatar="loadingAvatar" @showInfo="showInfo" @showChat="showChat" @showFriend="showFriend" @showWordCloud="showWordCloud" @logout="logout"></sidebar>
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
                <div id="wordCloud" v-if="isShowWordCloud">
                    <img class ="logo" :src="wordCloudSrc"  alt="wordCloud">
                </div>
                <chat-area ref="chatArea" v-if="showChatArea" :friend-nickname="chattingFriendNickname" :friend-avatar="chattingFriendAvatar" :my-avatar="currentUser.avatar" :chatting-info="chatInfo[chattingFriendID]" :friendID="chattingFriendID" :is-loading-history="loadingHistory" @sendMessage="sendMessage"></chat-area>
                <friend-info v-if="showFriendInfo"></friend-info>
                <add-friend v-if="showAddFriend" :loading="searchLoading" :apply-messages="applyMessages" :found-user="foundUser" :show-found="showFound" :showFoundRemind='showFoundRemind' @accept="acceptApply" @reject="rejectApply" @addFriend="sendAddFriend" @searchUser="searchUser"></add-friend>
            </el-main>
        </el-container>
        <setting-window v-if="showSetting" :id="currentUser.id" :nickname="currentUser.nickname" :avatar-url="currentUser.avatar"  :changing-password="changingPassword" @switchShow="switchShow" @closeInfo="closeSetting" @changeAvatar="editAvatar" @changeNickname="editNickname" @changePassword="changePassword"></setting-window>
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
    const duration_time = 1500;
    export default {
        name: "home",
        components: {
            AddFriend,  //添加好友组件
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
                //是否正在加载聊天历史
                loadingHistory: false,
                //是否展示聊天侧边栏
                isShowChat:true,
                //是否展示好友资料侧边栏
                isShowFriend:false,
                //是否展示个人资料设置
                showSetting:false,
                //是否显示修改密码:
                changingPassword:false,
                //是否展示聊天对话框
                showChatArea:false,
                //是否显示添加好友窗口
                showAddFriend:false,
                //是否显示词云
                isShowWordCloud:false,
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
                //词云图源
                wordCloudSrc:"",
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
            //是否有新消息
            unreadMessageNum(){
                return this.$store.getters['friendInfo/getNewInfoNum'];
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
                                this.$message({message:"登录信息已过期",type:"warning",duration:duration_time});
                                window.localStorage.removeItem("username");
                                window.localStorage.removeItem("password");
                                setTimeout(()=>{
                                    this.$router.push("/Login");
                                },duration_time);
                            }
                            else
                                console.log("重复登录");
                        }
                        else if(result.status === 0)
                        {
                            this.$message({message:"请求参数错误",type:"error",duration:duration_time});
                            setTimeout(()=>{
                                this.$router.push("/Login");
                                },duration_time);
                        }
                        else
                        {
                            this.$message({message:"服务器无响应",type:"warning",duration:duration_time});
                            window.localStorage.removeItem("username");
                            window.localStorage.removeItem("password");
                            setTimeout(()=>{
                                this.$router.push("/Login");
                                },duration_time);
                        }
                    });
                }
                //初始化
                //此处调用接口获取当前用户资料
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
                    })
                    .catch((error)=>{
                        this.$message({message:'获取用户资料时，服务器响应错误',type:"warning",duration:duration_time});
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
                                    //处理是否有新消息
                                    let newInfo = false;
                                    if (result2.data[i].sender !== id)
                                        newInfo = true;
                                    //处理消息内容
                                    let recentInfo = result2.data[i].last_text;
                                    if(recentInfo.length > 18)  //消息内容过长省略部分内容
                                    {
                                        recentInfo = recentInfo.substr(0,18);
                                        recentInfo +="...";
                                    }
                                    //处理时间显示
                                    let time_show = "";     //侧边栏显示的时间
                                    let time = new Date(result2.data[i].last_time);
                                    let now = new Date();
                                    let yesterday = new Date(now.getTime()-24*60*60*1000);
                                    if(time.getFullYear() !== now.getFullYear())
                                        time_show = time.getFullYear().toString()+"年"+(time.getMonth()+1).toString()+"月"+time.getDate().toString()+"日";
                                    else if(time.getMonth() === now.getMonth() && time.getDate() === now.getDate())
                                        time_show = time.getHours().toString()+":"+time.getMinutes().toString();
                                    else if(time.getMonth() === yesterday.getMonth() && time.getDate() === yesterday.getDate())
                                        time_show = "昨天";
                                    else
                                        time_show = (time.getMonth()+1).toString()+"月"+time.getDate().toString()+"日";
                                    let t ={
                                        id:result2.data[i].friend,
                                        newInfo:newInfo,
                                        unread_num:result2.data[i].unread_cnt,
                                        message:recentInfo,
                                        time:time_show,
                                    };
                                    recentChat.push(t);
                                }
                                //let test = {
                                //    id:"test0",
                                //    newInfo:true,
                                //    unread_num:1,
                                //    message:"哈哈哈哈哈哈",
                                //    time:"昨天",
                                // };
                                // let test1 = {
                                //     id:"test2",
                                //     newInfo:true,
                                //     unread_num:1,
                                //     message:"哈哈哈哈哈哈",
                                //     time:"昨天",
                                // };
                                // let test2 = {
                                //     id:"test3",
                                //     newInfo:true,
                                //     unread_num:2,
                                //     message:"哈哈哈哈哈哈",
                                //     time:"昨天",
                                // };
                                //recentChat.push(test);
                                //recentChat.push(test1);
                                //recentChat.push(test2);
                                if(result2.data.length===0)
                                {
                                if(id === "test1"){
                                        let te ={
                                        id:"test2",
                                        newInfo:false,
                                        unread_num:0,
                                        message:"123test",
                                        time:"5月1日",
                                    };
                                        recentChat.push(te);
                                    }
                                if(id === "test2"){
                                        let te ={
                                        id:"test1",
                                        newInfo:false,
                                        unread_num:0,
                                        message:"123test",
                                        time:"5月1日",
                                    };
                                        recentChat.push(te);
                                    }
                                if(id === "test3"){
                                        let te ={
                                        id:"test1",
                                        newInfo:false,
                                        unread_num:0,
                                        message:"123test",
                                        time:"5月1日",
                                    };
                                        recentChat.push(te);
                                    }
                                
                                }

                                this.$store.commit('friendInfo/addRecent',recentChat);  //更新好友信息
                                this.loadingChatBar = false;
                        })
                            .catch((error)=>{
                                console.log("获取聊天列表出错",error);
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
            //切换用户资料及修改密码显示
            switchShow(){
                this.changingPassword = !this.changingPassword;
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
                        this.$message({message:"已注销,即将跳转至登录页",type:"success",duration:duration_time});
                        setTimeout(()=>{
                            window.location.href="/Login";
                            // this.$router.push("/Login");
                        },800);
                    }
                    else if(result.status === 1){
                        this.$message({message:"未登录",type:"warning",duration:duration_time});
                        setTimeout(()=>{
                            window.location.href="/Login";
                            // this.$router.push("/Login");
                        },800);
                    }
                    else{
                        this.$message({message:"服务器未响应",type:"warning",duration:duration_time});
                    }
                });
            },
            //隐藏个人资料
            closeSetting(){
                this.changingPassword = false;
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
                            this.$message({message:'修改成功',type:'success',duration:duration_time});
                        })
                        .catch((error)=>{
                            this.$message({message:'修改失败',type:'error',duration:duration_time});
                            console.log("修改头像返回错误，",error);
                        })
                }
            },
            //修改昵称
            editNickname(nickname){
                //此处需调用接口修改昵称
                this.$axios.put('/v1/userinfo/'+this.currentUser.id+'/nickname', {
                    nickname:nickname
                })
                    .then(()=> {
                    this.$store.commit('currentUser/setNickname', nickname);
                    this.$message({message:'修改成功',type:'success',duration:duration_time});
                })
                    .catch((error)=> {
                    console.log("修改昵称返回错误:",error);
                    this.$message({message:'修改失败,服务器响应错误',type:'warning',duration:duration_time});
                })
            },
            //修改密码
            changePassword(newPassword){
                console.log(newPassword);
                this.$axios.put('/v1/userinfo/'+this.currentUser.id+'/password',{
                    password:newPassword
                })
                    .then((result)=> {
                        console.log("修改密码成功返回:",result);
                        let encode_password = 'q1m4'+newPassword;
                        encode_password = Base64.encode(encode_password);
                        window.localStorage.setItem('password',encode_password);
                        this.$message({message:'密码修改成功',type:'success',duration:duration_time});

                })
                    .catch((error)=>{
                        console.log("修改密码失败返回:",error);
                        this.$message({message:'密码修改失败',type:'error',duration:duration_time});
                })

            },
            //载入好友聊天对话框
            toChat(id,nickname,avatar){
                this.isInit = false;
                this.showFriendInfo = false;
                this.showAddFriend = false;
                this.showChatArea = false;
                this.isShowWordCloud = false;
                this.showChatArea = true;
                this.chattingFriendNickname = nickname;
                this.chattingFriendAvatar = avatar;
                this.chattingFriendID = id;
                //初次载入时，应调用接口向后台获取与该好友聊天记录,并将数据存入store，后续更新store即可
                if(this.chatInfo[id]===undefined){
                    //获取聊天历史
                    this.loadingHistory = true;
                    let now = new Date().getTime().toString()
                    this.$axios.get('/v1/chat/'+this.currentUser.id+'/history/'+id+'/'+now)
                        .then((result)=>{
                            console.log("获取聊天历史返回",result);
                            let temp = [];
                            for(let i=0;i<result.data.length;i++)
                            {
                                let isFriend = false;
                                if(result.data[i].sender === id)
                                    isFriend = true;
                                let time = this.getUtcTime(result.data[i].time);
                                let t ={
                                    message:result.data[i].text,
                                    isFriend:isFriend,
                                    isRead:result.data[i].is_read,
                                    time:time,
                                    activeRate:result.data[i].Sentiment
                                }
                                temp.push(t);
                            }
                            let chatHistory = {};
                            chatHistory[id] = temp;
                            this.$store.commit('chatInfo/addChatInfo',chatHistory);
                            this.loadingHistory = false;

                    })
                        .catch((error)=>{
                            console.log("获取聊天历史失败",error);
                            this.$message({message:'获取聊天历史失败',type:'error',duration:duration_time});
                            this.loadingHistory = false;
                    })

                }
                //载入时判断是否有新信息，有则去除新消息提醒，将对方发送的未读信息修改为已读，并向后台发送已读反馈
                if(this.chatList[id].newInfo === true && this.chatList[id].unread_num >0)
                {
                    //去除好友新消息提醒
                    this.$store.commit('friendInfo/removeNew',id);
                    //将对方发送的未读信息修改为已读
                    //this.$store.commit('chatInfo/readFriendUpdate',id);
                    //向后台发送已读反馈
                    this.$socket.emit('messageReadSend',id,
                        (result)=> {
                        if(result.status === 2){
                            console.log("已读反馈发送成功");
                        }
                        else if(result.status === 1){
                            if(result.reason === 0)
                                console.log("已读反馈发送失败，用户未登录，后台拒绝服务");
                            else if(result.reason === 1)
                                console.log("已读反馈发送失败，接收者非好友，后台拒绝服务");
                            else if(result.reason === 2)
                                console.log("已读反馈已发送，无更新");
                            else if(result.reason === 3)
                                console.log("已读反馈发送失败，不可发送给自己，后台拒绝服务");
                            else
                                console.log("已读反馈发送失败，未知返回值:",result.reason);
                        }
                        else if(result.status === 0)
                            console.log("已读反馈发送失败，参数错误");
                        else{
                            console.log("服务器响应错误");
                            this.$message({message:'服务器响应错误',type:'error',duration:duration_time});
                        }
                    });
                }
                // console.log(this.chatInfo[this.chattingFriendID]);
            },
            //载入添加好友窗口
            toAdd(){
                this.isInit = false;
                this.showFriendInfo = false;
                this.showChatArea = false;
                this.showAddFriend = true;
                this.isShowWordCloud = false;
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
                    else if(result.status === 1){
                        if(result.reason === 0)
                            this.$message({message:"服务器拒绝服务:未登录",type:"warning",duration:duration_time});
                        else if(result.reason === 1)
                            this.$message({message:"服务器拒绝服务:申请者为自身",type:"warning",duration:duration_time});
                        else if(result.reason === 2)
                            this.$message({message:"服务器拒绝服务:申请者不存在",type:"warning",duration:duration_time});
                        else if(result.reason === 3)
                            this.$message({message:"服务器拒绝服务:申请者已是您的好友",type:"warning",duration:duration_time});
                    }
                    else
                        this.$message({message:"请求参数错误",type:"error",duration:duration_time});
                });
            },
            //拒绝好友添加请求
            rejectApply(applyId){
                //此处需要调用拒绝好友请求接口（参数提供添加者ID，被添加者ID ）
                this.$axios.put('/v1/friend/'+this.currentUser.id+'/applicants/reject/'+applyId)
                    .then((result)=>{
                        console.log("拒绝好友申请返回",result);
                        this.$message({message:"已拒绝",type:"success",duration:duration_time});
                        this.$store.commit('applyList/reject',applyId); //更新申请列表
                    })
                    .catch((error)=>{
                        console.log("拒绝申请返回出错,",error.response);
                        if(error.response.status === 409)
                            this.$message({message:"申请者不存在",type:"warning",duration:duration_time});
                        else if(error.response.status === 400)
                            this.$message({message:"请求参数错误",type:"error",duration:duration_time});
                        else
                            this.$message({message:"服务器无响应",type:"error",duration:duration_time});
                    });
            },
            //查找用户
            searchUser(id){
                if (id==="")
                    this.$message({message:"账号不能为空",type:'warning',duration:duration_time});
                else if(id.length<3)
                    this.$message({message:'输入账号过短',type:'warning',duration:duration_time});
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
                                this.$message({message:'服务器响应错误',type:'warning',duration:duration_time});
                        })
                }


            },
            //发送添加好友请求
            sendAddFriend(id){
                if(id === this.currentUser.id)
                    this.$message({message:'不可添加自己为好友',type:'warning',duration:duration_time});
                else if(this.$store.getters['friendInfo/getFriend'](id) === undefined)
                    this.$socket.emit('friendApplySend',id,
                        (result)=>{
                        console.log("发送好友请求返回",result);
                        if (result.status === 2)
                            this.$message({message:"已发送",type:"success",duration:duration_time});
                        else if(result.status === 1 && result.reason===0)
                            this.$message({message:"用户未登录,服务器拒绝服务",type:"error",duration:duration_time});
                        else if(result.status === 1 && result.reason===1)
                            this.$message({message:"不可添加自己为好友,服务器拒绝服务",type:"error",duration:duration_time});
                        else if(result.status === 1 && result.reason===2)
                            this.$message({message:"该用户已在您的好友列表中",type:"warning",duration:duration_time});
                        else if(result.status === 1 && result.reason===3)
                            this.$message({message:"存在重复好友申请，请待对方处理",type:"warning",duration:duration_time});
                        else if(result.status === 1 && result.reason===4) {
                            this.$message({message:id+"通过了你的好友请求",type:"success",duration:duration_time});
                            this.$store.commit('applyList/accept', id);
                            let avatar,nickname;
                            this.$axios.get('v1/userinfo/'+id)
                                .then((result)=>{
                                    console.log("好友资料返回",result);
                                    avatar = result.data.photo;
                                    nickname = result.data.nickname;
                                    if (avatar === "")  //用户未设置过头像，采用默认头像
                                        avatar = default_avatar;
                                    // console.log(this.$store.state.currentUser.id);
                                    let friend = {};
                                    friend[id]={nickname:nickname,avatar:avatar,newInfo:false,unread_num:0,recentMessage:{}};
                                    this.$store.commit('friendInfo/addFriendInfo',friend);  //更新好友列表
                                })
                                .catch((error)=>{
                                    this.$message({message:'服务器响应错误',type:"warning",duration:duration_time});
                                    console.log('处理申请反馈时，服务器响应错误:',error.response);
                                });
                        }
                        else
                            this.$message({message:"服务器响应错误",type:"error",duration:duration_time});
                    });
                else
                    this.$message({message:'该用户已在您的好友列表中',type:'warning',duration:duration_time});
            },
            //载入好友资料
            toFriend(){
                this.isInit = false;
                this.showAddFriend = false;
                this.showChatArea = false;
                this.showFriendInfo = true;
                this.isShowWordCloud = false;
            },
            //发送消息
            sendMessage(message){
                let time = new Date().getTime();
                let time_show = this.utcTimeToString(time);
                let info =  {id:this.chattingFriendID,message:{message:message,isFriend:false,isRead:false,time:time_show}};
                let receiver = this.chattingFriendID;
                this.$socket.emit('messageSend',{receiver:receiver,text:message,time:time},
                    (result)=>{
                    console.log("发送聊天信息回执result",result);
                    console.log("发送聊天信息回执result.data",result.data);
                    console.log("发送聊天信息回执result.status",result.status);
                    console.log("发送聊天信息回执result.reason",result.reason);
                    if(result.status == 2){
                        this.$message({message:"发送成功",type:"success",duration:800});
                        let UpdateInfo = {id:this.chattingFriendID,message:{message:result.data.text,isFriend:false,isRead:false,time:time_show,utcTime:time}};
                        this.$store.commit('chatInfo/sendUpdate',UpdateInfo);
                        this.$refs.chatArea.scrollBottom();
                    }
                    else{
                        this.$message({message:"发送失败,服务器响应错误",type:"error",duration:800});
                    }
                });
            },
            //将utc时间转化为年月日字符串
            utcTimeToString (utc){
                let time = new Date(utc);
                let timeString = time.getFullYear().toString()+"年 "+(time.getMonth()+1).toString()+"月"+time.getDate().toString()+"日 "+time.getHours().toString()+":"+time.getMinutes().toString();
                return timeString;
            },
            //显示词云
            showWordCloud(){
                this.isInit = false;
                this.showAddFriend = false;
                this.showChatArea = false;
                this.showFriendInfo = false;
                this.isShowWordCloud = true;
                //调用接口获取词云图
                this.$axios.get('/v1/nlp/'+this.currentUser.id+'/cloud')
                    .then((result)=>{
                        this.wordCloudSrc = result.data;
                    })
                    .catch((error)=>{
                        if(error.response.status === 400)
                            this.$message({message:'请求参数错误,词云图获取失败',type:'error',duration:duration_time});
                        else if(error.response.status === 409)
                        {
                            if(error.response.data ===0)
                                this.$message({message:'信息过少,无法获取词云图',type:'info',duration:duration_time});
                            else
                                this.$message({message:'服务响应错误,词云图获取失败',type:'info',duration:duration_time});
                        }
                        else
                            this.$message({message:'服务响应错误,词云图获取失败',type:'error',duration:duration_time})
                    })
            }
        },
        sockets: {
            //用户强制登出事件
            userLogout(){
                this.$message({message:"您的账号已在其他地方登录,即将登出",type:"warning",duration:2000});
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
                setTimeout(()=>{
                    window.location.href="/Login";
                    // this.$router.push("/Login");
                },2000);
            },
            //收到好友申请
            friendApplyRece(requester){
                this.$message({message:'收到新好友申请:'+requester,type:"info",duration:duration_time});
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
                this.$message({message:response+"通过了你的好友请求",type:"info",duration:duration_time});
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
                        this.$message({message:'服务器响应错误',type:"warning",duration:duration_time});
                        console.log('处理申请反馈时，服务器响应错误:',error.response);
                    });
            },
            //已读反馈事件
            messageReadRece(receiver){
                console.log("消息已读反馈",receiver);
                //将自己发送给该好友信息修改为已读
                this.$store.commit('chatInfo/readMeUpdate',receiver);
            },
            //接收消息反馈事件
            messageRece(response){
            //----------------response:sender,text,time,sentiment---------------
                console.log("接收体",response);
                console.log("接收好友",response.sender);
                console.log("消息",response.text);
                

                //*************
                //实时渲染
                //**************
                let Sender = response.sender;
                let Text = response.text;
                let time_show="";
                let Time = new Date(response.time);
                time_show = this.utcTimeToString(response.time);
                console.log("收到新的信息Time:",Time)
                console.log("收到新的信息time_show:",time_show)
                let ActiveRate = response.sentiment;
                let Is_read = true;
                let Is_friend = true;
                //***************
                //处理未读消息
                //****************
                if(Sender!=this.chattingFriendID)
                {
                    this.chatList[Sender].unread_num=this.chatList[Sender].unread_num+1;
                    Is_read = false;
                }
                else{
                //this.$store.commit('chatInfo/removeNew',id);
                //this.toChat(Sender,this.$store.state.friendInfoDic[Sender].nickname,this.$store.state.friendInfoDic[Sender].avatar);
                this.$socket.emit('messageReadSend',Sender);
                this.$refs.chatArea.scrollBottom();
                }


                let info =  {id:Sender,message:{message:Text,isFriend:Is_friend,isRead:Is_read,time:time_show,utcTime:Time.getTime() ,activeRate:ActiveRate}};

                //*****************
                //********查看chatInfo有没有sender,没有则增加
                //************
                if(this.chatInfo[Sender]===undefined)
                    {
                    console.log("新增sender的info",info);
                    this.$store.commit('friendInfo/addRecent',info);
                    }

                //console.log("收到新的信息is_Friend:",Is_friend);
                //console.log("收到新的信息Sender:",Sender);
                else
                {
                this.$store.commit('chatInfo/sendUpdate',info);
                }


                
                //修改最近聊天信息info:[{id:~,newInfo:~,unread_num:~,message:~,time:~},...]
                /*
                let recentChat = {
                    id:Sender,
                    newInfo:Is_read,
                    unread_num:this.chatList[Sender].unread_num,
                    time:time_show,
                    recentMessage:{message:Text,time:time_show}
                }
                let arrrayRecent = [];
                arrrayRecent.push(recentChat);
                console.log("待存储info：",arrrayRecent);
                this.$store.commit('friendInfo/addRecent',arrrayRecent);
                //console.log("获取最近好友信息：",this.$store.state.friendInfoDic[Sender]);
                */
                

            },
            disconnect(){
                this.$message({message:"服务器已断开连接",type:"error",duration:duration_time});
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
    #init,#wordCloud{
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
