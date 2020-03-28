function removeUnderScores(object) {
  const newObject = {};
  Object.keys(object).filter((key) => key.charAt(0) !== '_').forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
}
module.exports = {
  packageJSON(body, options) {
    const json = removeUnderScores(JSON.parse(body));
    json.name = options.projectName;
    json.main = `${options.destDir}/index.cjs.js`;
    json.module = `${options.destDir}/index.esm.js`;
    json.buildSettings.entry = options.entryFile;
    json.buildSettings.include = `${options.entryDir}/**/*`;
    json.buildSettings.iife.name = options.browserGlobalName;
    json.buildSettings.iife.file = `${options.destDir}/index.iife.js`;
    json.types = `${options.destDir}/types/${options.entryFileName}.d.ts`;
    json.author.name = options.author.name;
    json.author.email = options.author.email;
    // delete author.* if name or email is blank
    if (json.author.email == '' && json.author.name == '') delete json.author;
    else if (json.author.name == '') delete json.author.name;
    else if (json.author.email == '') delete json.author.email;
    // delete 
    delete json.bundleDependencies;
    delete json.deprecated;
    return JSON.stringify(json, null, 2);
  },
  tsConfigJSON(body, options) {
    const json = JSON.parse(body);
    json.compilerOptions.declarationDir = `${options.destDir}/types`;
    json.include = [`${options.entryDir}/**/*`];
    json.exclude = ['node_modules', options.destDir];
    return JSON.stringify(json, null, 2);
  },
  gitIgnore(body, options) {
    return [
      'node_modules',
      options.destDir
    ].join('\n');
  },
  npmIgnore(body, options) {
    return [
      'node_modules'
    ].join('\n');
  },
  through(body, options) {
    return body;
  }
}