const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const mdLinks = (file, options) => {
  // let o = {
  //   validade: false,
  //   stats: false,
  // };
  // Object.assign(o,options)
  return new Promise((resolve, reject) => {
    fs.stat(file, (errFile, stats) => {
      if (errFile) {
        reject(errFile.message);
      } else if (stats.isDirectory()) {
        resolveDirectory(file, options, resolve, reject);
      } else {
        resolveFile(file, options, resolve, reject);
      }
    });
  });
}

const resolveDirectory = (file, options, resolve, reject) => {
  fs.readdir(file, 'utf-8', (errDir, files) => {
    if (!errDir) {
      let arrayMdlinks = files.map((archive) => {
        return mdLinks(`${file}\\${archive}`, options);
      })
      Promise.all(arrayMdlinks).then((objectList) => {
        const list = objectList.flat();
        resolve(list);
      })
    } else {
      reject(errDir.message)
    }
  });
}

const regexMdLinks = /\[([^\]]*)\]\(([^\)]*)\)/gm;

const resolveFile = (file, options, resolve, reject) => {
  fs.readFile(file, 'utf8', (errReadFile, data) => {
    let arrayLinks = [];
    if (errReadFile) {
      reject(errReadFile.message);
    } else if (path.extname(file) === '.md') {
      let filterRegex = data.match(regexMdLinks);
      if (filterRegex) {
        filterRegex.forEach((textAndLink) => {
          let verifyBreakLine = textAndLink.replace(/(\r\n|\n|\r)/, '')
          const text = verifyBreakLine.match(/\[([^\]]*)\]/)[1];
          const href = verifyBreakLine.match(/\]\(([^\)]*)\)/)[1];
          arrayLinks.push({ text, href, file });
        });
        if (options && options.validate) {
          let teste = arrayLinks.map((item) => {
            return validateLink(item)
          })
          Promise.all(teste).then((t) => {
            resolve(t);
          })
          return;
        }
      }
    }
    resolve(arrayLinks);
  });
}

const validateLink = (objLink) => {
  return new Promise((resolve) => {
    if (objLink.href.indexOf('https') === 0) {
      https.get(objLink.href, (res) => {
        const code = res.statusCode;
        const message = res.statusMessage;
        objLink.validate = { code, message };
        resolve(objLink);
      })
    } else if (objLink.href.indexOf('http') === 0) {
      http.get(objLink.href, (res) => {
        const code = res.statusCode;
        const message = res.statusMessage;
        objLink.validate = { code, message };
        resolve(objLink);
      })
    } else {
      const message = 'invalid format';
      objLink.validate = { message };
      resolve(objLink);
    }
  })
}

// module.exports = mdLinks;

mdLinks('C:\\Users\\jessi\\Documents\\Programacao\\Javascript\\Testes\\teste-controlado', {validate:true})
  .then((links) => {
    console.log(links);
  })