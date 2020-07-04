const fs = require('fs');
const path = require('path');

const mdLinks = (file) => {
  return new Promise((resolve, reject) => {
    fs.stat(file, (errFile, stats) => {
      if (errFile) {
        reject(errFile.message);
      } else if (stats.isDirectory()) {
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
            console.log(errDir.message)
          }
        });
      } else {
        fs.readFile(file, 'utf8', (errReadFile, data) => {
          let arrayLinks = [];
          if (errReadFile) {
            console.log(errReadFile.message);
          } else if (path.extname(file) === '.md') {
            const regexMdLinks = /\[([^\]]*)\]\(([^\)]*)\)/gm;
            let firstFilter = data.match(regexMdLinks);
            if (firstFilter) {
              firstFilter.forEach((textAndLink) => {
                let verifyBreakLine = textAndLink.replace(/(\r\n|\n|\r)/, '')
                const text = verifyBreakLine.match(/\[([^\]]*)\]/)[1];
                const href = verifyBreakLine.match(/\]\(([^\)]*)\)/)[1];
                arrayLinks.push({ text, href, file });
              });
            }
          }
          resolve(arrayLinks);
        });
      }
    });
  });
}

module.exports = mdLinks
// mdLinks('C:\\Users\\jessi\\Documents\\Programacao\\Javascript\\Testes\\teste-controlado').then((links) => {
//   console.log(links);
// })