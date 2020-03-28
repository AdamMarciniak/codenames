
module.exports = {
  randomString: (length = 5) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let output = "";
    for (let i = 0; i < length; i += 1) {
      output += chars[Math.floor(Math.random() * chars.length)];
    }
    return output;
  }
}
