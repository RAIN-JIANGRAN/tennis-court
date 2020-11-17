const axios = require('axios');
const sendMsgToDingTalk = (msg) => {
  let data = {
    msgtype: 'markdown',
    markdown: {
      title: '网球播报',
      text: msg,
    }
  }
  var config = {
    method: 'post',
    url: 'https://oapi.dingtalk.com/robot/send?access_token=f59654c7d172272c3a833e4370933d20ab8485da69d146c03dd54fff93ff092f',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };
  axios(config)
}

module.exports = {sendMsgToDingTalk}
