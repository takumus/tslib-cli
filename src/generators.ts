import {PackageJSON} from './package.json';
import Settings from './settings';
import sortPackageJson from 'sort-package-json';
import utils from './utils';
function removeUnderScores(object: any) {
  const newObject: any = {};
  Object.keys(object).filter((key) => key.charAt(0) !== '_').forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
}
export type GeneratorFunction = ((body: string, settings: Settings) => string) | ((body: string) => string);
export const generators = {
  packageJSON(body: string, settings: Settings) {
    const json: PackageJSON = removeUnderScores(JSON.parse(body));
    json.name = settings.projectName;
    json.main = `${settings.destDir}/index.cjs.js`;
    json.module = `${settings.destDir}/index.esm.js`;
    json.scripts.prebuild = `rimraf ${settings.destDir}`;
    json.buildSettings.entry = settings.entryFile;
    json.buildSettings.include = `${settings.entryDir}/**/*`;
    json.buildSettings.browser.name = settings.browserGlobalName;
    json.buildSettings.browser.file = `${settings.destDir}/index.iife.js`;
    json.buildSettings.browser.exportWithNodeModules = settings.browserExportWithNodeModules;
    json.buildSettings.cjs_esm.exportWithNodeModules = settings.cjsesmExportWithNodeModules;
    json.types = `${settings.destDir}/types/${settings.entryFileName}.d.ts`;
    json.author.name = settings.author.name;
    json.author.email = settings.author.email;
    // delete author.* if name or email is blank
    if (json.author.name == '') delete json.author;
    else if (json.author.email == '') delete json.author.email;
    // delete 
    delete json.bundleDependencies;
    delete json.deprecated;
    return sortPackageJson(utils.toFormattedJson(json));
  },
  tsConfigJSON(body: string, settings: Settings) {
    const json = JSON.parse(body);
    json.compilerOptions.declarationDir = `${settings.destDir}/types`;
    json.include = [`${settings.entryDir}/**/*`];
    json.exclude = ['node_modules', settings.destDir];
    return utils.toFormattedJson(json);
  },
  gitIgnore(body: string, settings: Settings) {
    return body + ['node_modules', settings.destDir].join('\n');
  },
  npmIgnore(body: string) {
    return body + '\n' + ['node_modules'].join('\n');
  },
  through(body: string) {
    return body;
  }
}