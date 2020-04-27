

# QingMang

## 2020/04/27

在下一版本中的「青芒」服务器中：

*Socket.IO*模块将会**支持**以下事件：

- `v1/friend`
- `v1/friend/remove`
- `v1/friend/add`
- `v1/friend/access`
- `v1/friend/refuse`

>  备注：在下下版本中，*HTTP*模块将会**支持**以下请求：
>
> - `GET` /v1/history/:room_id

---

> 好友添加的原理
>
> 好友添加基于消息机制。所谓消息，即是指发送双方都有一个信箱，通信就是将消息发往对方的信箱，而且不作备份。用户一上线就会打开信箱，直到下线。信箱里面的消息的删留，由用户决定。
>
> 客户端代理用户发送消息，服务器作信使，并且帮用户打开信箱、管理消息。

---

**Event** `v1/friend`

服务器填充好友消息信箱，以便用户打开信箱能接收到消息。

**Kind** $SC$

**Purpose**

|          | **Client -> Server** | **Server -> Client**               |
| -------- | -------------------- | ---------------------------------- |
| **emit** |                      | 服务器将数据库中的消息塞到用户信箱 |
| **on**   |                      | 客户端打开信箱                     |

**Callback Params**

|        | **Client -> Server** |                               | **Server -> Client**            |
| ------ | -------------------- | ----------------------------- | ------------------------------- |
|        |                      | user_id `String`              | **接收人**用户名 (指代信箱号)   |
| (None) |                      | friends `Array`               |                                 |
|        |                      | friends[i] `Object`           |                                 |
|        |                      | friends[i].friend_id `String` | 消息中的好友用户名              |
|        |                      | friends[i].type `String`      | "add"-请求添加/ "refused"被删除 |

**Note**

安全性较低，因为存在伪造user_id的请求。

命名不一致性，user_id与其它API的username不一致。

耦合度较高，后续业务添加可能存在空闲字段。

---

**Event** `v1/friend/remove`

某用户移除信箱内的某条好友消息。

**Kind** $CS$

**Purpose**

|          | **Client -> Server**     | **Server -> Client** |
| -------- | ------------------------ | -------------------- |
| **emit** | 客户端移除好友消息       |                      |
| **on**   | 服务器删除数据库中的记录 |                      |

**Callback Params**

|                    | **Client -> Server**                                  |      | **Server -> Client** |
| ------------------ | ----------------------------------------------------- | ---- | -------------------- |
| user_id `String`   | 用户名 (指代信箱号)                                   |      |                      |
| friend_id `String` | 好友用户名 (不显然的，好友用户名与消息是一对一的关系) |      |                      |

**Note**

安全性较低，因为存在伪造user_id的请求。

安全性较低，因为存在伪造friend_id的请求。

命名不一致性，user_id与其它API的username不一致。

耦合度较高，目前的业务虽然好友用户名与消息是一对一的关系，但不保证以后。

---

**Event** `v1/friend/add`

某用户向除自己外的某个用户的信箱投递添加好友消息。

**Kind** $CS$

**Purpose**

|          | **Client -> Server**        | **Server -> Client** |
| -------- | --------------------------- | -------------------- |
| **emit** | 客户端投递添加好友消息      |                      |
| **on**   | 服务器emit `v1/friend` 事件 |                      |

**Callback Params**

|                    | **Client -> Server**            |      | **Server -> Client** |
| ------------------ | ------------------------------- | ---- | -------------------- |
| user_id `String`   | **投递人**用户名                |      |                      |
| friend_id `String` | 待添加的好友用户名 (指代信箱号) |      |                      |

**Note**

安全性较低，因为存在伪造user_id的请求。

命名不一致性，user_id与其它API的username不一致。

---

**Event** `v1/friend/access`

某用户向某用户的信箱回发确认好友消息。

**Kind** $CS$

**Purpose**

|          | **Client -> Server**        | **Server -> Client** |
| -------- | --------------------------- | -------------------- |
| **emit** | 客户端投递确认添加好友消息  |                      |
| **on**   | 服务器emit `v1/friend` 事件 |                      |

**Callback Params**

|                    | **Client -> Server**            |      | **Server -> Client** |
| ------------------ | ------------------------------- | ---- | -------------------- |
| user_id `String`   | **投递人**用户名                |      |                      |
| friend_id `String` | 待接受的好友用户名 (指代信箱号) |      |                      |

**Note**

安全性较低，因为存在伪造user_id的请求。

命名不一致性，user_id与其它API的username不一致。

---

**Event** `v1/friend/refuse`

某用户向某用户的信箱投递回绝好友消息。

**Kind** $CS$

**Purpose**

|          | **Client -> Server**        | **Server -> Client** |
| -------- | --------------------------- | -------------------- |
| **emit** | 客户端投递回绝好友消息      |                      |
| **on**   | 服务器emit `v1/friend` 事件 |                      |

**Callback Params**

|                    | **Client -> Server**            |      | **Server -> Client** |
| ------------------ | ------------------------------- | ---- | -------------------- |
| user_id `String`   | **投递人**用户名                |      |                      |
| friend_id `String` | 待回绝的好友用户名 (指代信箱号) |      |                      |

**Note**

安全性较低，因为存在伪造user_id的请求。

命名不一致性，user_id与其它API的username不一致。

---



## 2020/04/25

注明`room_id`为`String`类型。



## 2020/04/23

在下一版本中的「青芒」服务器中：

*Socket.IO*模块将会**支持**以下事件：

- `v1/join room`

- `v1/leave room`

- `v1.1/message`

注意，所有事件均挂载在`chat`的命名空间下，并且不再使用*Socket.IO*中`room`的概念。

*Socket.IO*模块将会**废弃**以下事件：

- ~~`v1/message`~~

---

**Event** `v1/join room`

客户端显示地请求加入房间，服务器不加验证地通过该请求。

**Kind** $CS$

**Purpose**

| stream/action | **Client -> Server** | **Server -> Client** |
| ------------- | -------------------- | -------------------- |
| **emit**      | 客户端请求加入某房间 |                      |
| **on**        | 授权客户端加入某房间 |                      |

**Callback Params**

|                   | **Client -> Server** |        | **Server -> Client** |
| ----------------- | -------------------- | ------ | -------------------- |
| room_id `String`  | 房间号               | (None) |                      |
| username `String` | 用户名               |        |                      |

---

**Event** `v1/leave room`

客户端显示地请求离开房间，服务器不加验证地通过该请求。

**Kind** $CS$

**Purpose**

|           | **Client -> Server** | **Server -> Client** |
| --------- | -------------------- | -------------------- |
| **emit ** | 客户端请求离开某房间 |                      |
| **on**    | 授权客户端离开某房间 |                      |

**Callback Params**

|                   | **Client -> Server** |        | **Server -> Client** |
| ----------------- | -------------------- | ------ | -------------------- |
| room_id `String`  | 房间号               | (None) |                      |
| username `String` | 用户名               |        |                      |

---

**Event** `v1.1/message`

客户端向某房间除自己外的所有人发送信息，服务器不加验证地通过该请求。

**Kind** $C_{one}SC_{others}$

**Purpose**

|          | **Client -> Server** | **Server -> Client** |
| -------- | -------------------- | -------------------- |
| **emit** | 客户端发送消息       | 服务器转发该消息     |
| **on**   | 服务器emit该事件     | 客户端接收该消息     |

**Callback Params**

|                     | **Client -> Server** |                     | **Server -> Client** |
| ------------------- | -------------------- | ------------------- | -------------------- |
| room_id `String`    | 房间号               | room_id             | 房间号               |
| msg `Object`        | 消息体               | msg `Object`        | 消息体               |
| msg.sender `String` | 用户名               | msg.sender `String` | 用户名               |
| msg.text `String`   | 消息文本             | msg.text `String`   | 消息文本             |

---

