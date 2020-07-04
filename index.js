const fs = require('fs');
const path = require('path');

const mdLinks = (file) => {
  return new Promise((resolve, reject) => {
    fs.stat(file, (errFile, stats) => {
      if (errFile) {
        reject(errFile.message);
      } else if (stats.isDirectory()) {
        resolveDirectory(file, resolve, reject);
      } else {
        resolveFile(file, resolve, reject);
      }
    });
  });
}

const resolveDirectory = (file, resolve, reject) => {
  fs.readdir(file, 'utf-8', (errDir, files) => {
    if (!errDir) {
      let arrayMdlinks = files.map((archive) => {
        return mdLinks(`${file}\\${archive}`);
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

const resolveFile = (file, resolve, reject) => {
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
          console.log('oi');
        });
      }
    }
    resolve(arrayLinks);
  });
}
// module.exports = mdLinks;

mdLinks('C:\\Users\\jessi\\Documents\\Programacao\\Javascript\\Testes\\teste-controlado')
.then((links) => {
  console.log(links);
})