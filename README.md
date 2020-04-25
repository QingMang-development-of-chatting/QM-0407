# QingMang

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

