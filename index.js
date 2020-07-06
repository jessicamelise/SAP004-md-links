const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const mdLinks = (file, options) => {
  let op = { validade: false, stats: false };
  Object.assign(op, options);
  return new Promise ((resolve, reject) => {
    try {
      getAllLinks(file, op).then((allLinks) => {
        resolve(allLinks);
      });
    } catch (err) {
      reject(err);
    }
  });
}

const getAllLinks = (file, op) => {
  return new Promise((resolve, reject) => {
    fs.stat(file, (errFile, stats) => {
      if (errFile) {
        reject(errFile.message);
      } else if (stats.isDirectory()) {
        resolveDirectory(file, op, resolve, reject);
      } else {
        resolveFile(file, op, resolve, reject);
      }
    });
  });
}

const resolveDirectory = (file, op, resolve, reject) => {
  fs.readdir(file, 'utf-8', (errDir, files) => {
    if (!errDir) {
      let arrayMdlinks = files.map((archive) => {
        return getAllLinks(`${file}\\${archive}`, op);
      })
      Promise.all(arrayMdlinks).then((objectList) => {
        const list = objectList.flat();
        resolve(list);
      })
    } else {
      reject(errDir.message);
    }
  });
}

const regexMdLinks = /\[([^\]]*)\]\(([^\)]*)\)/gm;

const resolveFile = (file, op, resolve, reject) => {
  fs.readFile(file, 'utf8', (errReadFile, data) => {
    let arrayLinks = [];
    if (errReadFile) {
      reject(errReadFile.message);
    } else if (path.extname(file) === '.md') {
      let filterRegex = data.match(regexMdLinks);
      if (filterRegex) {
        creatingArrayOfLinksInformation(filterRegex, arrayLinks, file);
        if (op.validate) {
          optionValidate(arrayLinks, resolve);
          return;
        }
      }
    }
    resolve(arrayLinks);
  });
}

const creatingArrayOfLinksInformation = (filteredValue, array, file) => {
  filteredValue.forEach((textAndLink) => {
    let verifyBreakLine = textAndLink.replace(/(\r\n|\n|\r)/, '');
    const text = verifyBreakLine.match(/\[([^\]]*)\]/)[1];
    const href = verifyBreakLine.match(/\]\(([^\)]*)\)/)[1];
    array.push({ text, href, file });
  });
}

const optionValidate = (array, resolve) => {
  let arrayObjOfLinks = array.map((item) => {
    return validateLink(item);
  });
  Promise.all(arrayObjOfLinks).then((resObj) => {
    resolve(resObj);
  });
}

const validateLink = (objLink) => {
  return new Promise((resolve) => {
    if (objLink.href.indexOf('https') === 0) {
      https.get(objLink.href, (res) => {
        objLink.validate = { code: res.statusCode, message: res.statusMessage };
        resolve(objLink);
      }).on('error', (err) => {
        objLink.validate = (`Got error: ${err.code}`);
        resolve(objLink);
      });
    } else if (objLink.href.indexOf('http') === 0) {
      http.get(objLink.href, (res) => {
        objLink.validate = { code: res.statusCode, message: res.statusMessage };
        resolve(objLink);
      }).on('error', (err) => {
        objLink.validate = (`Got error: ${err.code}`);
        resolve(objLink);
      });
    } else {
      objLink.validate = { message: 'invalid format' };
      resolve(objLink);
    }
  })
}

// module.exports = mdLinks;

mdLinks('C:\\Users\\jessi\\Documents\\Programacao\\Javascript\\Testes\\teste-controlado', {validate:true})
  .then((links) => {
    console.log(links);
  })