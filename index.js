const express = require('express');
const app = express();

const port = 4401;
let dataList = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

const server = app.listen(port, function () {
    console.log('Server is running');
});

const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });

wss.on('connection', function (ws) {
    console.log("A new client connected");
    ws.send(JSON.stringify(dataList));

    ws.on('message', function (msg) {
        dataList.push(JSON.parse(msg));
        broadcast();
    });
});

function broadcast() {
    const data = JSON.stringify(dataList);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}