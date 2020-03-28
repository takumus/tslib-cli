#!/usr/bin/env node
const rl = require('readline-sync');
const fs = require('fs');
const path = require('path');

const options = {
  projectName: '',
  browserGlobalName: '',
  destDir: './dist',
  entryFile: './src/index.ts',
  entryFileName: '',
  entryDir: ''
}
const projectRootDir = process.cwd();

function init() {
  console.log(`create library at : ${projectRootDir}`);
  options.projectName = path.basename(projectRootDir);
}
function input() {
  // input projectName
  options.projectName = readlineStr(`project name(${options.projectName}):`, options.projectName).toLowerCase();
  // input destDir
  options.destDir = readlineStr(`destination dir(${options.destDir}):`, options.destDir);
  // input browserGlobalName
  const tmpBGN = toCamelCase(options.projectName);
  options.browserGlobalName = readlineStr(`global name for browser(${tmpBGN}):`, toCamelCase(tmpBGN));
  // input entryFile
  options.entryFile = readlineStr(`entry file(${options.entryFile}):`, options.entryFile);
}
function beforeGenerate() {
  // create entryFileName from entryFile
  options.entryFileName = path.basename(options.entryFile, path.extname(options.entryFile));
  // create entryDir from entryFile
  options.entryDir = path.dirname(options.entryFile);
}
function generate() {
  fs.readdirSync(path.resolve(__dirname, './template'))
    .forEach((fileName) => {
      // replace
      const body = Object.keys(options).reduce(
        (body, key) => {
          return body.replace(new RegExp(`{{{${key}}}}`, 'g'), options[key]);
        },
        fs.readFileSync(path.resolve(__dirname, `./template/${fileName}`)).toString()
      )
      // save
      fs.writeFileSync(
        path.resolve(projectRootDir, fileName.replace(/\.template/, '')),
        body,
        {
          encoding: 'utf8'
        }
      );
    });
  const entryDir = path.resolve(projectRootDir, path.dirname(options.entryFile));
  if (!fs.existsSync(entryDir)) {
    fs.mkdirSync(entryDir, { recursive: true });
    fs.writeFileSync(path.resolve(projectRootDir, options.entryFile), '');
  }
}
function afterGenerate() {
  readlineStr('complete!\nyou should run `npm install` and `npm run build`', '');
}
function readlineStr(message, defaultInput) {
  const value = rl.question(message, {
    defaultInput: defaultInput
  });
  return value === '' ? defaultInput : value;
}
// function readlineBool(message, defaultInput) {
//   const value = rlStr(message, defaultInput ? 'y' : 'n');
//   return /y|Y/.test(value);
// }
// function boolToYN(value) {
//   return value ? 'yes' : 'no';
// }
function toCamelCase(value) {
  return value.split("-").map((v) => v.charAt(0).toUpperCase() + v.substr(1)).join('');
}
init();
input();
beforeGenerate();
generate();
afterGenerate();