let express = require('express');
let app = express();
let http = require('http');
let https = require('https');
let server = http.createServer(app);
let io = require('socket.io').listen(server);

let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
});

io.sockets.on('connection', client => {
    connections.push(client);
    console.log(`Connected: ${connections.length} sockets connected`);

    const options = {
        host: 'randomuser.me',
        path: '/api',
        method: 'GET',

        headers: {
            'Content-Type': 'application/json'
        }
    };

    https.get(options, function(res) {
        //console.log("Got response: " + res.statusCode);

        res.on("data", function(chunk) {
            let tmp = chunk + '';
            console.log('---------------------');
            console.log(tmp);
            //let jsonData = JSON.parse(tmp);
            //console.log(jsonData);
        });
    }).on('error', function(e) {
        //console.log("Got error: " + e.message);
    });

    client.on('disconnect', client => {
        connections.splice(connections.indexOf(client), 1);
        console.log(`Disconnected: ${connections.length} sockets still connected`);
    });

    client.on('send message', data => {
        io.sockets.emit('new message', {msg: data});
        console.log(data);
    });
});
