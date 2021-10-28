const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require("cors");
const port = 6970;

setTimeout(() => http.listen(port, () => console.log(`IO websocket listening on port ${port}!`)));

module.exports = io;
