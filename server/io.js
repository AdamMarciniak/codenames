const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const port = 6971;

setTimeout(() => http.listen(port, () => console.log(`Example app listening on port ${port}!`)));

module.exports = io;
