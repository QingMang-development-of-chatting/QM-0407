//聊天对话框组件
<template>
    <div class="chatArea" >
        <div class="chatAreaHead">
            <span class="headText">{{friendNickname}}</span>
        </div>
        <div id="chatAreaInfo" v-loading="isLoadingHistory">
            <div class="messageItem" v-for="(piece,index) in chattingInfo" :key="index" >
                <div class="me" v-if="!piece.isFriend"  @mouseover="selectedItem(index)" @mouseleave="cancelSelect()">
                    <div class="myAvatar">
                        <el-avatar  shape="square" :size="60" fit="cover" :src="myAvatar" ></el-avatar>
                    </div>
                    <div class="meSendTime" :style="showSendTime(index)">{{piece.time}}</div>
                    <div class="myMessage" :class="{positiveStyle:piece.activeRate>=0.6,normalStlye:piece.activeRate<0.6&&piece.activeRate>=0.5,negativeStyle:piece.activeRate<0.5}">{{piece.message}}</div>

                    <div class="readMeTips" v-show="piece.isRead">已读</div>
                </div>
                <div class="friend" v-if="piece.isFriend" @mouseover="selectedItem(index)" @mouseleave="cancelSelect()">
                    <div class="friendAvatar">
                        <el-avatar  shape="square" :size="60" fit="cover" :src="friendAvatar" ></el-avatar>
                    </div>
                    <div class="friendSendTime" :style="showSendTime(index)">{{piece.time}}</div>
                    <div class="friendMessage" :class="{positiveStyle:piece.activeRate>=0.6,normalStlye:piece.activeRate<0.6&&piece.activeRate>=0.5,negativeStyle:piece.activeRate<0.5}">{{piece.message}}</div>
                 </div>
            </div>
        </div>
        <!-- 表情区域 -->
        <div class="browBox" v-if="faceShow">
            <ul>
                <li v-for="(item,index) in faceList" :key="index" @click="getBrow(index)">{{item}}</li>
            </ul>
        </div>
        <div class="chatAreaInput">
            <div class="inputMenu">
                <img id="emojiIcon" :src="emoji" alt="emoji" @click="faceContent"/>
            </div>
            <div class="inputArea">
                <label>
                    <textarea v-model = "messageInput" class="inputText" maxlength="180" placeholder="请输入消息内容"/>
                </label>
                <br/>
                <el-button id="send" size="medium" @click="sendMessage(messageInput)">发送</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import emoji from'../../assets/emoji.png'
    const appData = require("@/assets/emojis.json");
    export default {
        props: {
            friendID:String,    //好友ID
            friendNickname:String,  //好友昵称
            friendAvatar:String,    //好友头像
            myAvatar:String,    //我的头像
            chattingInfo: Array,    //聊天记录
            isLoadingHistory:Boolean,
        },
        data(){
            return {
                //表情图标
                emoji: emoji,
                //输入栏信息
                messageInput: "",
                //鼠标悬浮的消息序号
                overIndex:-1,
                faceList: [],
                faceShow: false,
                getBrowString: "",
                messageColor:"",
            }
        },
        
        mounted() {
            this.scrollBottom();
        },
        watch:{
            friendID(){
                this.messageInput = "";
            }
        },
        methods:{
            //滚轮滚动到底部
            scrollBottom(){
                let div = document.getElementById('chatAreaInfo');
                setTimeout(()=>{
                div.scrollTop = div.scrollHeight;},0);
            },
            //发送消息
             sendMessage(messageInput)
            {
                this.$emit('sendMessage',messageInput); //触发父组件sendMessage事件
                this.messageInput = "";
                this.faceShow = false;
            },
            //显示发送时间
            selectedItem(i){
                this.overIndex = i;
            },
            //隐藏发送时间
            cancelSelect(){
                this.overIndex = -1;
            },
            //控制发送时间显示
            showSendTime(index){
                if(index === this.overIndex)
                    return "visibility:visible";
                else
                    return "visibility:hidden";
            },
            faceContent() {
                this.faceShow = !this.faceShow;
                if (this.faceShow == true) {
                    for (let i in appData) {
                        this.faceList.push(appData[i].char);
                    }
                } else {
                    this.faceList = [];
                }
            },
            // 获取用户点击之后的标签 ，存放到输入框内
            getBrow(index) {
                for (let i in this.faceList) {
                    if (index == i) {
                        this.getBrowString = this.faceList[index];
                        this.messageInput += this.getBrowString;
                    }
                }
            },
        }
    };
</script>
<style lang="css" scoped>
    .chatAreaHead{
        height:9%;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
        text-align: left;
    }
    #chatAreaInfo{
        height:65%;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
        overflow-y: auto;
    }
    .headText{
        position: relative;
        font-size: 22px;
        top:14px;
        left:30px;
    }
    .me{
        margin-top: 10px;
        float: right;
        clear: both;
        margin-right: 10px;
        height:auto;
        margin-bottom: 30px;
    }
    .friend{
        margin-top: 10px;
        float: left;
        clear: both;
        margin-left: 10px;
        height:auto;
        margin-bottom: 30px;
    }
    .myMessage{
        position: relative;
        top:20px;
        float: right;
        left: 110px;
        background-color: rgba(34, 255, 0, 0.44);
        padding: 10px;
        margin-right: 8px;
        border-radius: 2px;
        text-align: left;
        max-width:50rem;
        width: fit-content;
        width: -moz-fit-content;
        word-wrap: break-word;
        white-space: pre-wrap;
    }
    .positiveStyle{
        color:#FF6600;
    }
    .normalStyle{
        color:#000000;
    }
    .negativeStyle{
        color:#009999;
        /*color:#888888;*/
    }
    .friendMessage{
        position: relative;
        top:20px;
        right: 110px;
        float: left;
        background-color: white;
        padding: 10px;
        margin-left: 8px;
        border-radius: 2px;
        text-align: left;
        max-width:50rem;
        width: fit-content;
        width: -moz-fit-content;
        word-wrap: break-word;
        white-space: pre-wrap;
    }
    .inputMenu{
        font-size: 20px;
    }
    .chatAreaInput{
        text-align: left;
        width: inherit;
    }
    .inputText{
        font-size:18px;
        border: unset;
        background-color: inherit;
        outline: none;
        width:95%;
        height:75px ;
        position: relative;
        left:20px;
        top:15px;
    }
    #send{
        background-color: rgba(222, 222, 222, 0.82);
        color:black;
        border: unset;
        position: relative;
        

        left:900px;
    }
    #send:hover{
        background-color: rgba(15, 177, 17, 0.88);
        color:white;
    }
    #emojiIcon{
        position: relative;
        left:20px;
        top:10px;
        width:20px;
    }
    #emojiIcon:hover{
        cursor: pointer;
    }
    .myAvatar{
        float:right;

    }
    #emojiIcon:hover{
        cursor: pointer;
    }
    .friendAvatar{
        float:left;
    }
    .readMeTips{
        position: relative;
        color: #cbcbcb;
        font-size: 14px;
        left:100px;
        top:30px;
        float: right;
    }
    .meSendTime{
        position: relative;
        right:15px;
        float:right;
        font-size: 12px;
        height: 15px;
        color: #525252;
    }
    .friendSendTime{
        position: relative;
        left:15px;
        float: left;
        font-size: 12px;
        height: 15px;
        color: #525252;
    }
    #chatAreaInfo{
        position:relative;
    }
    .browBox{
        position:absolute;
        bottom:180px;
        left:450px;
        height:200px;
        width:400px;
        overflow-y: scroll;
        /*text-align: left;*/
        padding-left: 0px;
        /*overflow: scroll;*/
        background: #ffffff;
        border-radius:15px 15px 15px 15px;

    }
    .browBox ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 5px;
        margin: 10px;
        /*background:#6625aa;*/

    }
    .browBox ul li {
        /*border: 1px solid;*/
        width: 50px;
        font-size: 20px;
        list-style: none;
        text-align: center;
    }
</style>
