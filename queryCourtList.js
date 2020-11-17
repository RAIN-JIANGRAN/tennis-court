const axios = require('axios');
const FormData = require('form-data');
const {sendMsgToDingTalk} = require('./broadcast')
const {stadiumList} = require('./staduimList')
const md5 = require('crypto').createHash('md5')

const scheduleList = [
  {
    date: '2020.11.17',
    sign: 'C61004E152745DB9C75079F76352CB1C',
  },
  {
    date: '2020.11.18',
    sign: '2A757A8F997462476683D1B2E4DA7C3E',
  },
  {
    date: '2020.11.19',
    sign: '9B1013C0FE84709A639F9251F4A3BFBA',
  },
  {
    date: '2020.11.20',
    sign: 'E80FC2A25B530E524BCE3F2AC3140A24',
  },
  {
    date: '2020.11.21',
    sign: 'A5E7F9AB7D6B0DC344D7B87987E412F2',
  },
  {
    date: '2020.11.22',
    sign: '48B543AC0791E9ECC84F62D058A9BD44',
  },
  {
    date: '2020.11.23',
    sign: '44CF9AE4702AD09F2625F45EA5F0F0D5',
  },
  {
    date: '2020.11.24',
    sign: '289193701288C70894A8800F729592A4',
  },
  {
    date: '2020.11.25',
    sign: '00C05132577D2480393D4E6541074268',
  },
];

const query = async (date, sign, stadiumId) => {
  var data = new FormData();
  data.append('biz', 'apiGetStadiumShedule');
  data.append('date', Number(new Date(date)) / 1000 + '');
  data.append('method', 'ios');
  data.append('nonce', 'qscvhi91rdxvgy76543efbxdr5hjk1aq');
  data.append('sign', sign);
  data.append('stadiumid', stadiumId);
  data.append('userid', '52291');

  var config = {
    method: 'post',
    url: 'http://yd8.sports8.com.cn/api/ydb/stadium/apiGetStadiumShedule',
    headers: {
      ...data.getHeaders()
    },
    data: data
  };
  let msg = ''
  let response = await axios(config);
  if (response.data.returnCode == 0) {
    const {fieldList, stadiumName} = response.data.returnData;
    let availableList = fieldList.reduce((acc, curr) => {
      return acc.concat(curr.shedule.filter(e => e.status == 0))
    }, []);
    if (availableList.length > 0) {
      msg += `### Available courts in ${stadiumName} \n`
      for (let item of availableList) {
        msg += `- ${item.name} ¥${item.expense} period:${item.timePoint}-${item.timePoint + 1} \n`
      }
    }
  }
  return msg
}

const stadiumKeyWord = '知音苑、达安花园、世纪同乐'

const queryAll = async () => {
  let msg = ''
  for (let item of scheduleList) {
    msg += `## ${new Date(item.date).toDateString()}\n`
    for (let stadium of stadiumList) {
      msg += await query(item.date, item.sign, stadium.stadiumid)
    }
  }
  // console.log(msg)
  sendMsgToDingTalk(msg)
}

const polling = async () => {
  let param = {
    biz:'apiGetStadiumShedule',
    date:'1605542400',
    method:'ios',
    nonce:'qscvhi91rdxvgy76543efbxdr5hjk1aq',
    stadiumid:'153',
    userid:'52291',
  }
  // md5.update(JSON.stringify(param))
  // md5.update(param.stadiumid)
  // md5.update(param.userid)
  // md5.update(param.nonce)
  // md5.update(param.method)
  // md5.update(param.biz)
  // console.log(md5.digest('hex'))
  let currHour = new Date().getHours()
  if (currHour > 8 && currHour < 24) {
    await queryAll()
  }
  setTimeout(() => {
    polling()
  }, 1000 * 60 * 30)
}

polling()
