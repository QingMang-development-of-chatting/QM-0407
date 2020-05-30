//聊天对话框组件
<template>
    <div class="chatArea">
        <div class="chatAreaHead">
            <span class="headText">{{friendNickname}}</span>
        </div>
        <div id="chatAreaInfo" >
            <div class="messageItem" v-for="piece in chattingInfo" :key="piece.index" >
                <div class="me" v-if="!piece.isFriend">
                    <div class="myAvatar">
                        <el-avatar  shape="square" :size="60" fit="cover" :src="myAvatar" ></el-avatar>
                    </div>
                    <div class="myMessage">{{piece.message}}</div>
                </div>
                <div class="friend" v-if="piece.isFriend">
                    <div class="friendAvatar">
                        <el-avatar  shape="square" :size="60" fit="cover" :src="friendAvatar" ></el-avatar>
                    </div>
                    <div class="friendMessage">{{piece.message}}</div>
                 </div>
            </div>
        </div>
        <div class="chatAreaInput">
            <div class="inputMenu">
                <img id="emojiIcon" :src="emoji" alt="emoji"/>
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
    export default {
        props: {
            friendID:String,    //好友ID
            friendNickname:String,  //好友昵称
            friendAvatar:String,    //好友头像
            myAvatar:String,    //我的头像
            chattingInfo: Array,    //聊天记录
        },
        data(){
            return {
                //表情图标
                emoji: emoji,
                //输入栏信息
                messageInput: "",
            }
        },
        watch:{
            friendID(){
                this.messageInput = "";
            }
        },
        mounted() {this.scrollBottom();
        },
        methods:{
            //发送消息
            scrollBottom(){
                let div = document.getElementById('chatAreaInfo');
                setTimeout(()=>{
                div.scrollTop = div.scrollHeight;},0);
            },
            sendMessage(messageInput)
            {
                this.$emit('sendMessage',messageInput); //触发父组件sendMessage事件
                this.messageInput = "";
                this.scrollBottom();
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
        float: right;
        clear: both;
        margin-right: 10px;
        height:auto;
        margin-bottom: 15px;
    }
    .friend{
        float: left;
        clear: both;
        margin-left: 10px;
        height:auto;
        margin-bottom: 15px;
    }
    .myMessage{
        position: relative;
        top:8px;
        float: right;
        background-color: rgba(34, 255, 0, 0.44);
        padding: 10px;
        margin-right: 8px;
        border-radius: 2px;
        text-align: left;
        max-width:55rem;
        width: fit-content;
        width: -moz-fit-content;
        word-wrap: break-word;
        white-space: pre-wrap;
    }
    .friendMessage{
        position: relative;
        top:8px;
        float: left;
        background-color: white;
        padding: 10px;
        margin-left: 8px;
        border-radius: 2px;
        text-align: left;
        max-width:55rem;
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
    .friendAvatar{
        float:left;
    }
</style>
