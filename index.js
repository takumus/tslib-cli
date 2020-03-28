#!/usr/bin/env node
const rl = require('readline-sync');
const fs = require('fs');
const path = require('path');
const generators = require('./generators');

const projectRootDir = process.cwd();

function init(options) {
  console.log(`create library at : ${projectRootDir}`);
  options.projectName = path.basename(projectRootDir);
}
function input(options) {
  options.projectName = readlineStr('project name', options.projectName).toLowerCase();
  options.destDir = readlineStr('destination dir', options.destDir);
  options.browserGlobalName = readlineStr('global name for browser', toCamelCase(options.projectName));
  options.entryFile = readlineStr('entry file', options.entryFile);
  options.author.name = readlineStr('author.name', options.author.name);
  options.author.email = readlineStr('author.email', options.author.name);
}
function beforeGenerate(options) {
  // create entryFileName from entryFile
  options.entryFileName = path.basename(options.entryFile, path.extname(options.entryFile));
  // create entryDir from entryFile
  options.entryDir = path.dirname(options.entryFile);
}
function generateAll(options) {
  // generate files
  generate("package.json", generators.packageJSON, options);
  generate("tsconfig.json", generators.tsConfigJSON, options);
  generate(".npmignore", generators.npmIgnore, options);
  generate(".gitignore", generators.gitIgnore, options);
  // copy files
  generate("rollup-base.config.js", generators.nothing, options);
  generate("rollup-browser.config.js", generators.nothing, options);
  generate("rollup.config.js", generators.nothing, options);
  generate(".babelrc", generators.nothing, options);

  // create src directories
  const entryDir = path.resolve(projectRootDir, path.dirname(options.entryFile));
  if (!fs.existsSync(entryDir)) fs.mkdirSync(entryDir, { recursive: true });
  // create ts file
  const tsFile = path.resolve(projectRootDir, options.entryFile);
  if (!fs.existsSync(tsFile)) fs.writeFileSync(tsFile, '', {});
}
function afterGenerate(options) {
  console.log('complete!\nyou should run `npm install` and `npm run build`');
}

function generate(name, generator, options) {
  const file = path.resolve(__dirname, './node_modules/@takumus/typescript-library-template', name);
  let body = '';
  try {
    body = fs.readFileSync(file).toString();
  }catch {}
  fs.writeFileSync(
    path.resolve(projectRootDir, name),
    generator(
      body,
      options
    )
  );
}
function readlineStr(message, defaultInput) {
  const value = rl.question(`${message}(${defaultInput}):`, {
    defaultInput: defaultInput
  });
  return value === '' ? defaultInput : value;
}
function toCamelCase(value) {
  return value.split("-").map((v) => v.charAt(0).toUpperCase() + v.substr(1)).join('');
}

(() => {
  const options = {
    projectName: '',
    browserGlobalName: '',
    destDir: './dist',
    entryFile: './src/index.ts',
    entryFileName: '',
    entryDir: '',
    author: {
      name: '',
      email: ''
    }
  };
  init(options);
  input(options);
  beforeGenerate(options);
  generateAll(options);
  afterGenerate(options);
})();