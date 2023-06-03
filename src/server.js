const express = require('express');
const serveStatic = require('serve-static');
const http = require('http');
const { Server } = require("socket.io");
const serial = require("./serial/index")

const webapp = express()
const server = http.Server(webapp);
const io = new Server();

webapp.use(serveStatic(__dirname + "/../public"));
server.listen(80, () => console.log("Serveur en écoute sur le port 80"));
io.listen(server);

var callback = null;

io.sockets.on('connection', (socket) => {

    socket.on("request_list_ports_com", async () => socket.emit("request_list_ports_com", await serial.get_serials()))

    if(callback != null) {

        callback(socket)

    }else{

        console.log("callback not initialized")

    }

});

const on = (cb) => {

    callback = cb;

}

module.exports = {on}