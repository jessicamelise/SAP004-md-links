const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const mdLinks = (file, options) => {
  let op = { validade: false, stats: false };
  Object.assign(op, options);
  return new Promise((resolve, reject) => {
    try {
      getAllLinks(file, op).then((allLinks) => {
        if (op.stats) {
          statsWithOrWithoutValidate(allLinks, op, resolve, reject);
        } else if (op.validate) {
          optionValidate(allLinks, resolve, reject);
        } else {
          resolve(allLinks);
        }
      }).catch (e => reject(e));
    } catch (err) { reject(err) };
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
        resolveFile(file, resolve, reject);
      }
    });
  });
}

const resolveDirectory = (file, op, resolve, reject) => {
  fs.readdir(file, 'utf-8', (errDir, files) => {
    try {
      if (!errDir) {
        let arrayMdlinks = files.map((archive) => {
          return getAllLinks(`${file}/${archive}`, op);
        });
        Promise.all(arrayMdlinks).then((objectList) => {
          const list = objectList.flat();
          resolve(list);
        }).catch(e=>reject(e));
      } else {
        reject(errDir.message);
      }
    } catch (err) { reject(err) };
  });
}

const regexMdLinks = /\[([^\]]*)\]\(([^\)]*)\)/gm;

const resolveFile = (file, resolve, reject) => {
  if (path.extname(file) === '.md') {
    fs.readFile(file, 'utf8', (errReadFile, data) => {
      try {
        let arrayLinks = [];
      if (errReadFile) {
        reject(errReadFile.message);
      } else {
        let filterRegex = data.match(regexMdLinks);
        if (filterRegex) {
          creatingArrayOfLinksInformation(filterRegex, arrayLinks, file);
        }
      }
      resolve(arrayLinks);
      } catch (err) { reject(err) };
    });
  } else {
    resolve([]);
  }
  
}

const creatingArrayOfLinksInformation = (filteredValue, array, file) => {
  filteredValue.forEach((textAndLink) => {
    let verifyBreakLine = textAndLink.replace(/(\r\n|\n|\r)/, '');
    const text = verifyBreakLine.match(/\[([^\]]*)\]/)[1];
    const href = verifyBreakLine.match(/\]\(([^\)]*)\)/)[1];
    array.push({ text, href, file });
  });
}

const optionValidate = (array, resolve, reject) => {
  let arrayObjOfLinks = array.map((item) => {
    return validateLink(item);
  });
  Promise.all(arrayObjOfLinks).then((resObj) => {
    resolve(resObj);
  }).catch(e=>reject(e));
}

const validateLink = (objLink) => {
  return new Promise((resolve, reject) => {
    try {
      if (objLink.href.indexOf('https:') === 0) {
        https.get(objLink.href, (res) => {
          objLink.validate = { code: res.statusCode, message: res.statusMessage };
          resolve(objLink);
        }).on('error', (err) => {
          objLink.validate = (`Got error: ${err.code}`);
          resolve(objLink);
        });
      } else if (objLink.href.indexOf('http:') === 0) {
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
    } catch (err) { reject(err) };
  });
}

const optionStats = (arrayWithAllLinks, op, addValidate) => {
  const totalLinks = arrayWithAllLinks.length;
  const totalDuplicates = findDuplicateLinks(arrayWithAllLinks).length;
  const uniqueLinks = totalLinks - totalDuplicates;
  if (op.validate) {
    return { Total: totalLinks, Unique: uniqueLinks, Broken: addValidate };
  }
  return { Total: totalLinks, Unique: uniqueLinks }
}

const findDuplicateLinks = (arrayLinks) => {
  let object = {};
  let result = [];
  arrayLinks.forEach((item) => {
    if (!object[item.href]) {
      object[item.href] = 0;
    }
    object[item.href] += 1;
  });
  for (var prop in object) {
    if (object[prop] >= 2) {
      result.push(prop);
    }
  }
  return result;
}

const statsWithOrWithoutValidate = (arrayWithAllLinks, op, resolve, reject) => {
  if (op.validate) {
    return optionValidateWithStats(arrayWithAllLinks, op, resolve, reject);
  }
  resolve(optionStats(arrayWithAllLinks, op))
}

const optionValidateWithStats = (array, op, resolve, reject) => {
  let totalWithStatsAndValidate = '';
  let resultArray = array.map((eachObjLink) => {
    return validateLink(eachObjLink);
  });
  Promise.all(resultArray).then((links) => {
    let brokenCodes = [];
    links.forEach((validate) => {
      let getCodes = validate.validate.code;
      if (!getCodes || getCodes >= 400 && getCodes <= 599) {
        brokenCodes.push(getCodes);
      }
    });
    totalWithStatsAndValidate = optionStats(array, op, brokenCodes.length)
    resolve(totalWithStatsAndValidate);
  }).catch(e=> reject(e));
}

module.exports = mdLinks;
