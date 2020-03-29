#!/usr/bin/env node
import argv from 'argv';
import fs  from 'fs';
import path from 'path';
import utils from './utils';
import readline from './readline';
import Settings from './settings';
import {generators, GeneratorFunction} from './generators';

const mkdirName = argv.run().targets[0] || '';
const projectRootDir = path.resolve(process.cwd(), mkdirName);
const libraryTemplateDir = '../node_modules/@takumus/typescript-library-template'
const currentSettiingFile = path.resolve(projectRootDir, 'tslib-cli.json');
// tasks
function init(settings: Settings) {
  // make projectName from dir path
  settings.projectName = path.basename(projectRootDir);
  // load current settings if exists
  if (fs.existsSync(currentSettiingFile)) {
    try {
      // extract
      const old = JSON.parse(fs.readFileSync(currentSettiingFile).toString());
      Object.keys(old).forEach((key) => {
        (<any>settings)[key] = old[key];
      });
      console.log(`edit a project in : ${projectRootDir}`);
      return;
    } catch{ }
  }
  console.log(`create a project in : ${projectRootDir}`);
}
async function input(settings: Settings) {
  readline.open();
  settings.projectName = (await readline.str(
    'project name',
    settings.projectName
  )).toLowerCase();
  // make default browserGlobalName from projectName
  settings.browserGlobalName = await readline.str(
    'global name of `browser`',
    utils.toBrowserName(settings.projectName)
  );
  settings.destDir = await readline.str(
    'destination directory',
    settings.destDir
  );
  settings.entryFile = await readline.str(
    'entry .ts file',
    settings.entryFile
  );
  settings.cjsesmExportWithNodeModules = await readline.yn(
    'export `cjs` and `ems` with `node_modules`?',
    settings.cjsesmExportWithNodeModules
  );
  settings.browserExportWithNodeModules = await readline.yn(
    'export `browser` with `node_modules`?',
    settings.browserExportWithNodeModules
  );
  settings.author.name = await readline.str(
    'package.json author.name',
    settings.author.name
  );
  settings.author.email = await readline.str(
    'package.json author.email',
    settings.author.email
  );
  readline.close();
}
function beforeGenerate(settings: Settings) {
  // make entryFileName from entryFile
  settings.entryFileName = path.basename(settings.entryFile, path.extname(settings.entryFile));
  // make entryDir from entryFile
  settings.entryDir = path.dirname(settings.entryFile);
}
function generateAll(settings: Settings) {
  // generate function
  const generate = (name: string, generator: GeneratorFunction, settings: Settings) => {
    let body = '';
    try {
      body = fs.readFileSync(path.resolve(__dirname, libraryTemplateDir, name)).toString();
    } catch { }
    fs.writeFileSync(path.resolve(projectRootDir, name), generator(body, settings));
  }
  // create project root directories
  if (!fs.existsSync(projectRootDir)) fs.mkdirSync(projectRootDir, { recursive: true });
  // generate files
  generate('package.json', generators.packageJSON, settings);
  generate('tsconfig.json', generators.tsConfigJSON, settings);
  generate('.npmignore', generators.npmIgnore, settings);
  generate('.gitignore', generators.gitIgnore, settings);
  generate('rollup-base.config.js', generators.through, settings);
  generate('rollup-browser.config.js', generators.through, settings);
  generate('rollup.config.js', generators.through, settings);
  generate('.babelrc', generators.through, settings);
  // create src directories
  const entryDir = path.resolve(projectRootDir, path.dirname(settings.entryFile));
  if (!fs.existsSync(entryDir)) fs.mkdirSync(entryDir, { recursive: true });
  // create entry ts file
  const tsFile = path.resolve(projectRootDir, settings.entryFile);
  if (!fs.existsSync(tsFile)) fs.writeFileSync(tsFile, '', {});
}
function afterGenerate(settings: Settings) {
  console.log(`complete!\nyou should ${mkdirName != '' ? `\`cd ${mkdirName}\` and ` : ''}run \`npm install\` and \`npm run build\``);
  fs.writeFileSync(currentSettiingFile, utils.toFormattedJson(settings));
}
(async () => {
  // default values
  const settings: Settings = {
    projectName: '',
    browserGlobalName: '',
    browserExportWithNodeModules: true,
    cjsesmExportWithNodeModules: false,
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
  init(settings);
  await input(settings);
  beforeGenerate(settings);
  generateAll(settings);
  afterGenerate(settings);
})();