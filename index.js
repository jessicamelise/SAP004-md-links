const fs = require('fs');
const path = require('path');
const { resolve } = require('path');

const mdLinks = (file) => {
  return new Promise((resolve, reject) => {
    let arrayLinks = [];
    fs.stat(file, (errFile, stats) => {
      if (errFile) {
        reject(errFile.message);
      } else if (stats.isDirectory()) {
        fs.readdir(file, 'utf-8', (errDir, files) => {
          if (!errDir) {
            files.forEach((archive) => {
              const verifyDot = archive.match(/^\w[^\s]*/);
              if (verifyDot) {
                mdLinks(`${file}\\${verifyDot[0]}`)
              }
            })
          } else {
            console.log(errDir.message)
          }
        });
      } else {
        fs.readFile(file, 'utf8', (errReadFile, data) => {
          if (errReadFile) {
            console.log(errReadFile.message);
          } else if (path.extname(file) === '.md') {
            const regexMdLinks = /\[([^\]]*)\]\(([^\)]*)\)/gm;
            let firstFilter = data.match(regexMdLinks);
            firstFilter.forEach((textAndLink) => {
              let verifyBreakLine = textAndLink.replace(/(\r\n|\n|\r)/, '')
              const text = verifyBreakLine.match(/\[([^\]]*)\]/)[1];
              const href = verifyBreakLine.match(/\]\(([^\)]*)\)/)[1];
              arrayLinks.push({ text, href, file });
            });
            // console.log(arrayLinks);
            console.log(resolve(arrayLinks))
            return arrayLinks
          }
        });
      }
    });
  });
}

// module.exports = mdLinks
mdLinks('c:\\Users\\jessi\\Documents\\Programacao\\Javascript\\Laboratoria efetivo\\SAP004-md-links')