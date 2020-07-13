const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const resultArray = require('./dir-test/array-result-test.js');

const mocks = {
  mockHttps: () => {
    https.get.mockImplementation((url, callback) => {
      if (url === 'https://jamelise.github.io/SAP004-cipher/') {
        return {
          on: (event, callbackOn) => {
            if (event === 'error') {
              callbackOn({ code: 'erro' });
            }
          }
        }
      } else if (url === 'https://img.youtube.com/vi/f0zL6Ot9y_w/0.jpg') {
        callback({ statusCode: 500, statusMessage: 'server error' });
      } else {
        callback({ statusCode: 200, statusMessage: 'Ok' });
      }
      return { on: () => { } };
    });
  },
  mockHttp: () => {
    http.get.mockImplementation((url, callback) => {
      if (url === 'http://jamelise.github.io/SAP004-cipher/') {
        return {
          on: (event, callbackOn) => {
            if (event === 'error') {
              callbackOn({ code: 'erro' });
            }
          }
        }
      } else if (url === 'http://img.youtube.com/vi/f0zL6Ot9y_w/0.jpg') {
        callback({ statusCode: 500, statusMessage: 'server error' });
      } else {
        callback({ statusCode: 200, statusMessage: 'Ok' });
      }
      return { on: () => { } };
    });
  },
  mockFsStat: () => {
    fs.stat.mockImplementation((file, callback) => {
      if (file === '/lala') {
        callback({message: 'caminho inválido'}, null);
      } else if (!path.extname(file)) {
        callback(null, { isDirectory: () => true});
      } else {
        callback(null, { isDirectory: () => false});
      }
    });
  },
  mockFsReaddir: () => {
    fs.readdir.mockImplementation((file, code, callback) => {
      if (file === './test/dir-test') {
        callback(null, ['array-result-test.js','test-no-links.md', 'test-with-links-http.md', 'test-with-links-https.md']);
      } else {
        callback({message: 'diretório invalido'}, null);
      }
    });
  },
  mockFsReadFile: () => {
    fs.readFile.mockImplementation((file, code, callback) => {
      if (file === './test/dir-test/test-with-links-https.md') {
        callback(null, resultArray.https);
      } else if (file === './test/dir-test/test-with-links-http.md') {
        callback(null, resultArray.http);
      } else if (file === './test/dir-test/test-no-links.md') {
        callback(null, ``);
      } else {
        callback({message: 'erro ao ler arquivo'}, null);
      }
    });
  }
}

module.exports = mocks;