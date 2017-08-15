const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 4001;
const index = require('./routes/index');
const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

io.origins((origin, callback) => {
    if (origin !== 'http://127.0.0.1:3000' && origin !== 'http://localhost:3000') {
        return callback('origin not allowed', false);
    }
    callback(null, true);
});

io.on('connection', socket => {
    console.log('New client connected'), setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on('test', (name, fn) => {
        manageDataform(socket, name)
        fn('test')
    });
    socket.on('disconnect', () => console.log('Client disconnected'));
});

const getApiAndEmit = async socket => {
    try {
        const res = await axios.get(
            'http://localhost/laravel-develop/public/io_user'
        );
        socket.emit('FromAPI', res.data);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};
const manageDataform = async socket => {
    try
    {
        const res = await axios.get(
            'http://localhost/laravel-develop/public/io_user'
        );
        socket.emit('FromTest', res);
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

server.listen(port, () => console.log(`Listening on port ${port}`));