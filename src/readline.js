const readline = require('readline');
let interface;
module.exports = {
  open() {
    interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  },
  str(message, defaultInput) {
    return new Promise((resolve) => {
      interface.question(`${message}: (${defaultInput})`, (answer) => {
        resolve(answer == '' ? defaultInput : answer);
      });
    });
  },
  yn(message, defaultInput) {
    return new Promise((resolve) => {
      interface.question(`${message}: (${defaultInput ? 'yes' : 'no'})`, (answer) => {
        resolve(answer == '' ? defaultInput : /yY/.test(answer));
      });
    });
  },
  close() {
    interface.close();
  }
}