const mdLinks = require('../index.js');
// const fs = require('fs');
const http = require('https');
const https = require('https');
const mocks = require('./mocks.js')

// jest.mock('fs');
jest.mock('http');
jest.mock('https');


describe('mdLinks', () => {

  beforeEach(() => {
    mocks.mockHttps();
    mocks.mockHttp();
  });

  // test('should be a function', () => {
  //   expect(typeof mdLinks).toBe('function');
  // });

  // test('should return all links of the directory', () => {
  //     return mdLinks('./test/dir-test').then((links) => {
  //     const result = links.length;
  //     expect(result).toEqual(8);
  //   });
  // });

  // test('should return error for wrong files', () => {
  //   expect.assertions(1);
  //   return mdLinks('/lala').catch((error) => {
  //     expect(error).toMatch("ENOENT: no such file or directory, stat 'C:\\lala'");
  //   });
  // });

  test('should call https validation', () => {
    return mdLinks('./test/dir-test/test-with-links-https.md', { validate: true }).then((links) => {
      // console.log(links);
      const result = links.map((eachLink) => {
        return eachLink.validate;
      })
      expect(result.length).toEqual(8);
      expect(https.get).toHaveBeenCalledTimes(7);
    });
  });

  test('should call http validation', () => {
    return mdLinks('./test/dir-test/test-with-links-http.md', { validate: true }).then((links) => {
      // console.log(links);
      const result = links.map((eachLink) => {
        return eachLink.validate;
      })
      expect(result.length).toEqual(8);
      expect(http.get).toHaveBeenCalledTimes(7);
    });
  });

  // test('should return the statistic of total number of links and non-repeated links', () => {
  //   return mdLinks('./test/dir-test', { stats: true }).then((links) => {
  //     expect(links).toEqual({ Total: 8, Unique: 7 });
  //   });
  // });

  // test('should return the statistic of total number of links, non-repeated links and broken links', () => {
  //   return mdLinks('./test/dir-test', { stats: true, validate:true }).then((links) => {
  //     expect(links).toEqual({ Total: 8, Unique: 7, Broken: 4 });
  //   });
  // });
});
