const https = require('https');
const http = require('http');

const mocks = {
  mockHttps: () => {
    https.get.mockImplementation((url, callback) => {
      if (url === 'https://jamelise.github.io/SAP004-cipher/') {
        return {
          on: (event, callbackOn) => {
            if(event === 'error') {
              callbackOn({code: 'erro'});
            }
          }
        }
      }else if (url === 'https://img.youtube.com/vi/f0zL6Ot9y_w/0.jpg') {
        callback({ statusCode: 500, statusMessage: 'server error' })
      } else {
        callback({ statusCode: 200, statusMessage: 'Ok' })
      } 
      return { on: () => {}}; 
    })
  },
  mockHttp: () => {
    http.get.mockImplementation((url, callback) => {
      if (url === 'http://jamelise.github.io/SAP004-cipher/') {
        return {
          on: (event, callbackOn) => {
            if(event === 'error') {
              callbackOn({code: 'erro'});
            }
          }
        }
      }else if (url === 'http://img.youtube.com/vi/f0zL6Ot9y_w/0.jpg') {
        callback({ statusCode: 500, statusMessage: 'server error' })
      } else {
        callback({ statusCode: 200, statusMessage: 'Ok' })
      } 
      return { on: () => {}}; 
    })
  },
}

module.exports = mocks;