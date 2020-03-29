#!/usr/bin/env node
const argv = require('argv');
const fs = require('fs');
const path = require('path');
const generators = require('./generators');
const utils = require('./utils');
const readline = require('./readline');
const mkdirName = argv.run().targets[0] || '';
const projectRootDir = path.resolve(process.cwd(), mkdirName);
const libraryTemplateDir = '../node_modules/@takumus/typescript-library-template'
const currentSettiingFile = path.resolve(projectRootDir, 'tslib-cli.json');
// tasks
function init(options) {
  // make projectName from dir path
  options.projectName = path.basename(projectRootDir);
  // load current settings if exists
  if (fs.existsSync(currentSettiingFile)) {
    try {
      // extract
      const old = JSON.parse(fs.readFileSync(currentSettiingFile));
      Object.keys(old).forEach((key) => {
        options[key] = old[key];
      });
      console.log(`edit library at : ${projectRootDir}`);
      return;
    } catch{ }
  }
  console.log(`create library at : ${projectRootDir}`);
}
async function input(options) {
  readline.open();
  options.projectName = (await readline.str('project name', options.projectName)).toLowerCase();
  options.destDir = (await readline.str('destination dir', options.destDir));
  // make default browserGlobalName from projectName
  options.browserGlobalName = (await readline.str('global name for browser', utils.toBrowserName(options.projectName)));
  options.entryFile = (await readline.str('entry file', options.entryFile));
  options.author.name = (await readline.str('author.name', options.author.name));
  options.author.email = (await readline.str('author.email', options.author.email));
  readline.close();
}
function beforeGenerate(options) {
  // make entryFileName from entryFile
  options.entryFileName = path.basename(options.entryFile, path.extname(options.entryFile));
  // make entryDir from entryFile
  options.entryDir = path.dirname(options.entryFile);
}
function generateAll(options) {
  // generate function
  const generate = (name, generator, options) => {
    let body = '';
    try {
      body = fs.readFileSync(path.resolve(__dirname, libraryTemplateDir, name)).toString();
    } catch { }
    fs.writeFileSync(path.resolve(projectRootDir, name), generator(body, options));
  }
  // create project root directories
  if (!fs.existsSync(projectRootDir)) fs.mkdirSync(projectRootDir, { recursive: true });
  // generate files
  generate('package.json', generators.packageJSON, options);
  generate('tsconfig.json', generators.tsConfigJSON, options);
  generate('.npmignore', generators.npmIgnore, options);
  generate('.gitignore', generators.gitIgnore, options);
  generate('rollup-base.config.js', generators.through, options);
  generate('rollup-browser.config.js', generators.through, options);
  generate('rollup.config.js', generators.through, options);
  generate('.babelrc', generators.through, options);
  // create src directories
  const entryDir = path.resolve(projectRootDir, path.dirname(options.entryFile));
  if (!fs.existsSync(entryDir)) fs.mkdirSync(entryDir, { recursive: true });
  // create entry ts file
  const tsFile = path.resolve(projectRootDir, options.entryFile);
  if (!fs.existsSync(tsFile)) fs.writeFileSync(tsFile, '', {});
}
function afterGenerate(options) {
  console.log(`complete!\nyou should ${mkdirName != '' ? `\`cd ${mkdirName}\` and ` : ''}run \`npm install\` and \`npm run build\``);
  fs.writeFileSync(currentSettiingFile, JSON.stringify(options, null, 2));
}
(async () => {
  // default values
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
  // tasks
  init(options);
  await input(options);
  beforeGenerate(options);
  generateAll(options);
  afterGenerate(options);
})();