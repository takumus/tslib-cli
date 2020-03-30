export default interface Settings {
  projectName: string,
  browserGlobalName: string,
  browserExportWithNodeModules: boolean,
  cjsExportWithNodeModules: boolean,
  esmExportWithNodeModules: boolean,
  destDir: string,
  entryFile: string,
  entryFileName: string,
  entryDir: string,
  author: {
    name: string,
    email: string
  }
};