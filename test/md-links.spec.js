const mdLinks = require('../index.js');

describe('mdLinks', () => {

  test('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  test('should return all links of the directory', () => {
    return mdLinks('./test/dir-test').then((links) => {
      const result = links.length;
      expect(result).toEqual(8);
    });
  });

  test('should return error for wrong files', () => {
    expect.assertions(1);
    return mdLinks('/lala').catch((error) => {
      expect(error).toMatch("ENOENT: no such file or directory, stat 'C:\\lala'");
    });
  });

  test('should return all links with validation', () => {
    return mdLinks('./test/dir-test', { validate: true }).then((links) => {
      const result = links.map((eachLink) => {
        return eachLink.validate;
      })
      expect(result.length).toEqual(8);
    });
  });

  ///falta teste do validate erro .catch

  test('should return the statistic of total number of links and non-repeated links', () => {
    return mdLinks('./test/dir-test', { stats: true }).then((links) => {
      expect(links).toEqual({ Total: 8, Unique: 7 });
    });
  });

  ///falta teste do stats erro .catch

  test('should return the statistic of total number of links, non-repeated links and broken links', () => {
    return mdLinks('./test/dir-test', { stats: true, validate:true }).then((links) => {
      expect(links).toEqual({ Total: 8, Unique: 7, Broken: 4 });
    });
  });

    ///falta teste do stats erro .catch
});
