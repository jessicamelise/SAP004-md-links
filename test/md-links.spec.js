const mdLinks = require('../index.js');
const fs = require('fs');
const http = require('https');
const https = require('https');
const mocks = require('./mocks.js');

jest.mock('fs');
jest.mock('http');
jest.mock('https');


describe('mdLinks', () => {

  beforeEach(() => {
    mocks.mockFsStat();
    mocks.mockFsReaddir();
    mocks.mockFsReadFile();
    mocks.mockHttp();
    mocks.mockHttps();
  });

  test('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  test('should return all links inside a directory', () => {
    return mdLinks('./test/dir-test').then((links) => {
      expect(links.length).toEqual(16);
    }).catch((e) => {
      console.log(e);
    });
  });

  test('should return error for wrong files', () => {
    expect.assertions(2);
    return mdLinks('/lala').catch((error) => {
      expect(error).toMatch("caminho inválido");
      expect(fs.readdir).toHaveBeenCalledTimes(1);
    });
  });

  test('should call https validation', () => {
    return mdLinks('./test/dir-test/test-with-links-https.md', { validate: true }).then((links) => {
      const result = links.map((eachLink) => {
        return eachLink.validate;
      });
      expect(result.length).toEqual(8);
      expect(https.get).toHaveBeenCalledTimes(7);
    });
  });

  test('should call http validation', () => {
    return mdLinks('./test/dir-test/test-with-links-http.md', { validate: true }).then((links) => {
      const result = links.map((eachLink) => {
        return eachLink.validate;
      });
      expect(result.length).toEqual(8);
      expect(http.get).toHaveBeenCalledTimes(7);
    });
  });

  test('should return the statistic of total number of links and non-repeated links', () => {
    return mdLinks('./test/dir-test', { stats: true }).then((links) => {
      expect(links).toEqual({ Total: 16, Unique: 13 });
    });
  });

  test('should return the statistic of total number of links, non-repeated links and broken links', () => {
    return mdLinks('./test/dir-test', { stats: true, validate:true }).then((links) => {
      expect(links).toEqual({ Total: 16, Unique: 13, Broken: 6 });
    });
  });
});
