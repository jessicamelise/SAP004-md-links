# Markdown Links

## Índice

* [1. A Biblioteca md-links](#1-a-biblioteca-md-links)
* [2. Ferramentas e Bibliotecas Utilizadas](#2-ferramentas-e-bibliotecas-utilizadas)
* [3. Guia de instalação](#3-guia-de-instalação)
* [4. Implementações Futuras](#4-implementações-futuras)
* [5. Autora](#5-autora)

***

## 1. A Biblioteca md-links

A biblioteca md-links lê e analisa arquivos no formato [Markdown](https://pt.wikipedia.org/wiki/Markdown),
para verificar se contém links e mostrar algumas estatísticas.

## 2. Ferramentas e Bibliotecas Utilizadas

* Vanilla JS.
* [Node.js](https://nodejs.org/pt-br/).
* [NPM](https://www.npmjs.com/).
* [expressões regulares (`RegExp`)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_Expressions).
* [Node.js File System](https://nodejs.org/api/fs.html).
* [Node.js Path](https://nodejs.org/api/path.html/).
* [Node.js http.get](https://nodejs.org/api/http.html#http_http_get_options_callback).
* [Node.js https.get](https://nodejs.org/api/https.html#https_https_get_url_options_callback).
* [Jest](https://jestjs.io/docs/en/getting-started.html).
* [ESLint](https://eslint.org/docs/user-guide/getting-started).

#### Versões

* [Node.js](https://nodejs.org/pt-br/): v12.16.1
* [NPM](https://www.npmjs.com/): 6.13.4
* [VS Code](https://code.visualstudio.com/): 1.46.0

## 3. Guia de Instalação

Essa biblioteca deve ser instalada via `npm install -g jessicamelise/SAP004-md-links`.

E oferece a seguinte interface:

### Require: `mdLinks(path, options)`
### CLI: `md-links <path-to-file> [options]`

* `path`: Rota do diretório ou do arquivo md direto.
* `options`: Um objeto com as seguintes propriedades:
  - `validate`: Um booleano que determina se deseja validar os links encontrados.
  - `stats`: Um booleano que determina que o retorno será apenas a quantidade total de links.

### Valor de Retorno com CLI (Command Line Interface - Interface de Linha de Comando)

Também pode ser executado da seguinte maneira através do terminal:

Se passar somente o arquivo ou diretório, teremos a seguinte estrutura:

```sh
$ md-links './dir/archive.md'
[
  {
    text: Nome da página,
    href: https://link-dessa-página.com,
    file: ./some/example.md
  },
  {
    text: Nome de outra página,
    href: https://link-dessa-outra-página.com,
    file: ./some/example.md
  }
]
```

Com o options `--validate`, veremos o seguinte:

```sh
$ md-links './dir/archive.md' --validate
[
  {
    text: Nome da página,
    href: https://link-dessa-página.com,
    file: ./some/example.md,
    validate: { code: 200, message: 'OK' }
  },
  {
    text: Nome de outra página,
    href: https://link-dessa-outra-página.com,
    file: ./some/example.md,
    validate: { 'Got error: message' }
  }
]
```

Com o options `--stats`, veremos o seguinte:

```sh
$ md-links './dir/archive.md' --stats
{ Total: 10, Unique: 6 }
```

E com os options `--stats` e `--validate`, temos:

```sh
$ md-links './dir/archive.md' --stats --validate
{ Total: 10, Unique: 6, Broken: 3 }
```

### Valor de retorno com require

Quando a função mdLinks é chamada passando somente o parametro de path, teremos o seguinte retorno:

* `text`: Texto que irá aparecer dentro de um link.
* `href`: URL encontrada.
* `file`: Rota do arquivo onde foi encontrado o link.

Por exemplo:

```js
const mdLinks = require("md-links");

mdLinks("./dir/archive.md")
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(err => console.log(err));
```

Se usarmos a mdLinks com o paramatro path e mais o options com o valor de validate = true, teremos o seguinte:

* `text`: Texto que irá aparecer dentro de um link.
* `href`: URL encontrada.
* `file`: Rota do arquivo onde foi encontrado o link.
* `validate`: Mostra o código e a mensagem de status do link (exemplo: code:200, message: 'OK').

Por exemplo:

```js
const mdLinks = require("md-links");

mdLinks("./dir/archive.md", { validate: true })
  .then(links => {
    // => [{ href, text, file, validate: { status, ok } }]
  })
  .catch(err => console.log(err));
```

Se usarmos a mdLinks com o paramatro path e mais o options com o valor de stats = true, teremos o seguinte:

* { Total: 'número total de links', Unique: 'número de links não repetidos' }.

Por exemplo:

```js
const mdLinks = require("md-links");

mdLinks("./dir/archive.md", { stats: true })
  .then(links => {
    // => { Total: 10, Unique: 6 }
  })
  .catch(err => console.log(err));
```

Se usarmos a mdLinks com o paramatro path e mais o options com o valor de stats e validate = true, teremos o seguinte:

* { Total: 'número total de links', Unique: 'número de links não repetidos', Broken: 'número de links quebrados' }.

Por exemplo:

```js
const mdLinks = require("md-links");

mdLinks("./dir/archive.md", { stats: true, validate: true })
  .then(links => {
    // => { Total: 10, Unique: 6, Broken: 3 }
  })
  .catch(err => console.log(err));
```
##### Para verificar suas intalações utilize: `npm ls -g --depth=0`
##### Para desinstalar o md-links use o comando: `npm uninstall -g md-links`

## 4. Implementações Futuras

* Implementar o filtro de links para não aceitar links de # e www;
* Acrescentar limite de 50 caracteres para o texto encontrado dentro do link;
* Adicionar a biblioteca [Chalk](https://github.com/chalk/chalk) para trazer informações coloridas;
* Adicionar mais testes que tratam os erros;
* Adicionar o número da linha onde se encontra o link;

## 5. Autora

Biblioteca desenvolvida por [Jéssica Melise](https://github.com/jessicamelise), como o quarto
projeto do Bootcamp da [Laboratória](https://github.com/Laboratoria), turma SAP004.