import BaseConfig from './rollup-base.config';
import pkg from './package.json';

export default {
  ...BaseConfig({
    ignoreNodeModules: false
  }),
  output: [{
    file: pkg.iife.file,
    name: pkg.iife.name,
    format: 'iife',
    globals: {}
  }]
};
