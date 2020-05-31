var f = require("./chatFunc.js");

switch(10)
{
  case(0):
  {
    f.insertUser({
      user_id: "0004",
      user_name: "测试",
      user_key: "123456",
    })
    break;
  }
  case(1):
  {
    f.logUser({
      user_id: "0001",
      user_key: "123456",
    })
    break;
  }
  case(2):
  {
    f.updUser({
      user_id: "0001",
      user_name: "test2",
    })
    break;
  }
  case(3):
  {
    f.searchUser({
      user_id: "0001",
    })
    break;
  }
  case(4):
  {
    f.sendRequest({
      host_id: "0001",
      friend_id: "0002",
    });
    f.readRequest({
      host_id: "0002"
    });
    f.sendAnswer({
      host_id: "0002",
      friend_id: "0001",
      answer: 301,
    })
    break;
  }
  case(5):
  {
    f.readAnswer({
      host_id: "0001",
    })
    break;
  }
  
}

switch(2)
{
  case(0):
  {
    f.insertRoom({
      host_id:"0001",
      user_id:["0003", "0004"]
    })
    break;
  }
  case(1):
  {
    f.insertChat({
      host_id:"0003",
      chat:["chat1", "chat2"],
      room:"552tapquFsrGV7zb",
    })
    break;
  }
  case(2):
  {
    f.readChat({
      user_id:"0001",
      room_id:"552tapquFsrGV7zb",
    })
  }
}