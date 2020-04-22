<template>
    <div class="chatArea">
        <div class="chatAreaHead">
            <span class="headText">{{friendNickname}}</span>
        </div>
        <div class="chatAreaInfo" >
            <div class="messageItem" v-for="message in chattingInfo" :key="message.index">
                <div class="me" v-if="!message.isFriend">
                    <span class="myMessage">{{message.chatInfo}}</span>
                    <el-avatar  shape="square" :size="60" fit="cover" :src="myAvatar" ></el-avatar>
                </div>
                <div class="friend" v-if="message.isFriend">
                    <el-avatar  shape="square" :size="60" fit="cover" :src="friendAvatar" ></el-avatar>
                    <span class="friendMessage">{{message.chatInfo}}</span>
                 </div>
            </div>
        </div>
        <div class="chatAreaInput">
            <div class="inputMenu">
                <img id="emojiIcon" :src="emoji"/>
            </div>
            <div class="inputArea">
                <textarea class="inputText" maxlength="180" placeholder="请输入消息内容"/>
                <br/>
                <el-button id="send" size="medium">发送</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import emoji from'../../assets/emoji.png'
    export default {
        props: {
            friendNickname:String,
            friendAvatar:String,
            myAvatar:String,
            chattingInfo: Array
        },
        data(){
            return {
                emoji: emoji
            }
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
    .chatAreaInfo{
        height:65%;
        border-bottom-style: ridge;
        border-bottom-color: rgba(48, 49, 51, 0.03);
        overflow-y: auto;
    }
    .headText{
        position: relative;
        font-size: 22px;
        top:14px;
        left:15px;
    }
    .me{
        margin-right: 10px;
        height:80px;
        text-align: right;
    }
    .friend{
        margin-left: 10px;
        height:80px;
        text-align: left;
    }
    .myMessage{
        background-color: rgba(34, 255, 0, 0.44);
        padding: 10px;
        margin-right: 8px;
        border-radius: 2px;
    }
    .friendMessage{
        background-color: white;
        padding: 10px;
        margin-left: 8px;
        border-radius: 2px;
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
</style>
