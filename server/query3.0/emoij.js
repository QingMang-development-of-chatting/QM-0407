/**
 * 
 */
const axios = require('axios');

/**
 * 上传表情
 * 用列表上传，格式：
 * "name": [
    "#1",
    "#2"
  ],
  "photo": [
    "1",
    "2"
  ]

  return:
  --200 成功
  --400 重名
 */
const insertEmoij = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/newEmoij',
        {    
            name: info.name,
            photo: info.photo
        }
    ).then(function(response){
        status = response.data;
        result = status;
    })
    return result;
}

/**
 * 输出全部的表情
 * 不需要输入
 */
const searchEmoij = async function(info) {
    result = false;

    await axios.post(
        'https://afusuj.toutiao15.com/searchEmoij',
        {    
            "hello":"world",
        }
    ).then(function(response){
        status = response.data;
        result = status;

        console.log(result);
    })
    return result;
}

exports.insertEmoij = insertEmoij;
exports.searchEmoij = searchEmoij;