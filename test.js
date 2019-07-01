const axios = require('axios');

const ins = axios.create({
  baseURL: 'http://app.recruit.test.lyml.me',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
})

ins.post('/api/recruit/list', {})
  .then(console.log)
  .catch(console.log)