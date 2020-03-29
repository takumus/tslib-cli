module.exports = {
  toBrowserName(value) {
    return value.split("/").pop().split("-").map((v) => v.charAt(0).toUpperCase() + v.substr(1)).join('');
  },
  toFormattedJson(object)  {
    return JSON.stringify(object, null, 2);
  }
}