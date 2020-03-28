#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const generators = require('./generators');
const utils = require('./utils');
const readline = require('./readline');

const projectRootDir = process.cwd();
const libraryTemplateDir = './node_modules/@takumus/typescript-library-template'
const configFile = path.resolve(projectRootDir, 'tslib-cli.json');
function init(options) {
  console.log(`create library at : ${projectRootDir}`);
  // generate projectName from dir path
  options.projectName = path.basename(projectRootDir);
}

async function input(options) {
  // open input
  readline.open();

  options.projectName = (await readline.str('project name', options.projectName)).toLowerCase();
  options.destDir = (await readline.str('destination dir', options.destDir));
  // generate default browserGlobalName from projectName
  options.browserGlobalName = (await readline.str('global name for browser', utils.toBrowserName(options.projectName)));
  options.entryFile = (await readline.str('entry file', options.entryFile));
  options.author.name = (await readline.str('author.name', options.author.name));
  options.author.email = (await readline.str('author.email', options.author.email));

  // open input
  readline.close();
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
  generate("rollup-base.config.js", generators.through, options);
  generate("rollup-browser.config.js", generators.through, options);
  generate("rollup.config.js", generators.through, options);
  generate(".babelrc", generators.through, options);

  // create src directories
  const entryDir = path.resolve(projectRootDir, path.dirname(options.entryFile));
  if (!fs.existsSync(entryDir)) fs.mkdirSync(entryDir, { recursive: true });
  // create ts file
  const tsFile = path.resolve(projectRootDir, options.entryFile);
  if (!fs.existsSync(tsFile)) fs.writeFileSync(tsFile, '', {});
}

function afterGenerate(options) {
  console.log('complete!\nyou should run `npm install` and `npm run build`');
  fs.writeFileSync(configFile, JSON.stringify(options, null, 2));
}

function generate(name, generator, options) {
  const file = path.resolve(__dirname, libraryTemplateDir, name);
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
(async () =>{
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
  // do tasks
  init(options);
  await input(options);
  beforeGenerate(options);
  generateAll(options);
  afterGenerate(options);
})();