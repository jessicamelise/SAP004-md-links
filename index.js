const fs = require('fs');

const mdLinks = (file) => {
  const promiseLinks = new Promise((res, rej) => {
    let arrayLinks = [];
    fs.stat(file, (errFile, stats) => {
      if (!errFile) {
        if (stats.isFile()) {
          fs.readFile(file, 'utf8', (errReadFile, data) => {
            if (!errReadFile) {
              const regexMdLinks = /\[([^\]]*)\]\(([^\)]*)\)/gm;
              let firstFilter = data.match(regexMdLinks);
              firstFilter.forEach((textAndLink) => {
                let verifyBreakLine = textAndLink.replace(/(\r\n|\n|\r)/gm, '')
                const text = verifyBreakLine.match(/\[([^\]]*)\]/)[1];
                const href = verifyBreakLine.match(/\(([^\)]*)\)/)[1];
                arrayLinks.push({ text, href, file });
              })
              // console.log(arrayLinks);
              res(arrayLinks);
            } else {
              rej(errReadFile.message);
            }
          });
        } else if (stats.isDirectory()) {
          console.log('is directory? ' + stats.isDirectory());
          fs.readdir(fileOrDir, 'utf-8', (err, file) => {
            console.log(fileOrDir);
            console.log(err);
            console.log(file);
          });
        }
      }
      else
        rej(errFile.message);
    });
  });
  // console.log(promiseLinks);
  return promiseLinks;
}

// module.exports = mdLinks
mdLinks('c:\\Users\\jessi\\Documents\\Programacao\\Javascript\\Laboratoria efetivo\\SAP004-md-links\\README.md')