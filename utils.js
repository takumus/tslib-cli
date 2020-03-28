const readline = require('readline-sync');
module.exports = {
  toBrowserName(value) {
    return value.split("/").pop().split("-").map((v) => v.charAt(0).toUpperCase() + v.substr(1)).join('');
  },
  readlineStr(message, defaultInput) {
    const value = readline.question(`${message}(${defaultInput}):`, {
      defaultInput: defaultInput
    });
    return value === '' ? defaultInput : value;
  }
}