#!/usr/bin/env node

const mdLinks = require("./index.js");

const file = process.argv[2];

const validate = process.argv.includes('--validate');
const stats = process.argv.includes('--stats');

mdLinks(file, {validate, stats}).then((result) => {
    console.log(result);
}).catch(e => console.log(e));
