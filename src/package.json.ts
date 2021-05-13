export interface Scripts {
  prebuild: string;
  build: string;
  'build:js': string;
  'build:types': string;
  'type-check': string;
  'type-check:watch': string;
}
export interface Browser {
  name: string;
  file: string;
  exportWithNodeModules: boolean;
}

export interface Cjs {
  exportWithNodeModules: boolean;
}

export interface Esm {
  exportWithNodeModules: boolean;
}

export interface BuildSettings {
  entry: string;
  include: string;
  browser: Browser;
  cjs: Cjs;
  esm: Esm;
  outputIgnoreLog: boolean;
}
export interface Author {
  name: string;
  email?: string;
}
export interface PackageJSON {
  name: string;
  version: string;
  description: string;
  license: string;
  main: string;
  module: string;
  types: string;
  scripts: Scripts;
  buildSettings: BuildSettings;
  author?: Author;
  bundleDependencies: any;
  deprecated: any;
}