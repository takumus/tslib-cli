import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import chalk from 'chalk';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default (options) => ({
  input: '{{{entryFile}}}',
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({ extensions, include: ['{{{entryDir}}}/**/*']}),
  ],
  external(id) {
    const isNodeModules = !(/\.+\//.test(id));
    const ignore = options.ignoreNodeModules ? isNodeModules : false;
    if (ignore) {
      console.log(chalk.bgRed(`-- ${id} `));
    }else {
      console.log(chalk.bgCyan(`++ ${id} `));
    }
    return ignore;
  }
});