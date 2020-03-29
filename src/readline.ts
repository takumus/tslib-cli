import readline from 'readline';
let readlineInterface: readline.Interface;
export default {
  open() {
    readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  },
  str(message: string, defaultInput: string) {
    return new Promise<string>((resolve) => {
      readlineInterface.question(`${message}: (${defaultInput}) `, (answer) => {
        resolve(answer == '' ? defaultInput : answer);
      });
    });
  },
  yn(message: string, defaultInput: boolean) {
    return new Promise<boolean>((resolve) => {
      readlineInterface.question(`${message}: (${defaultInput ? 'yes' : 'no'}) `, (answer) => {
        resolve(answer == '' ? defaultInput : /y|Y/.test(answer));
      });
    });
  },
  close() {
    readlineInterface.close();
  }
}