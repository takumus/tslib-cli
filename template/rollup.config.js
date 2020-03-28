import BaseConfig from './rollup-base.config';
import pkg from './package.json';

export default {
  ...BaseConfig({
    ignoreNodeModules: true
  }),
  output: [{
    file: pkg.main,
    format: 'cjs'
  }, {
    file: pkg.module,
    format: 'es',
  }],
};
