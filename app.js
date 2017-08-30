const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 4001;
const index = require('./routes/index');
const app = express();
app.use(index);
const configs = require('./configs');
const ApiUrl = configs.ApiUrl;

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

io.origins((origin, callback) => {
    if (origin !== 'http://127.0.0.1:3000' && origin !== 'http://localhost:3000') {
        return callback('origin not allowed', false);
    }
    callback(null, true);
});

io.on('connection', socket => {
    User.hasConnect(socket);
    socket.on('disconnect', () => User.hasDisconnect(socket));
    socket.on('login', (data, fn) => User.hasLogin(data, fn));
});

var User = {
    hasConnect(socket) {
        socket.emit('CheckData', socket.id);
    },
    hasDisconnect(socket) {
    },
    hasLogin(data, fn) {
        console.log(data)
        let objResponse = {};
        axios({
            method: 'POST',
            url: ApiUrl + '/realtime/login',
            data: data,
            dataType: 'JSON',
            async: false,
        }).then(function(response) {
            objResponse = response;
            if (typeof fn == 'function')
                fn(response.data);
            socket.emit('res_login', response.data);
        }).catch(function(error) {
            if (typeof fn == 'function')
                fn({rs: 0, error: error.text});
        });
    },
};

// const getApiAndEmit = async socket => {
//     try {
//         const res = await axios.get(
//             'http://localhost/laravel-develop/public/io_user'
//         );
//         socket.emit('FromAPI', res.data);
//     } catch (error) {
//         console.error(`Error: ${error.code}`);
//     }
// };
// const manageDataform = async socket => {
//     try
//     {
//         const res = await axios.get(
//             'http://localhost/laravel-develop/public/io_user'
//         );
//         socket.emit('FromTest', res);
//     } catch (error) {
//         console.error(`Error: ${error.code}`);
//     }
// };

server.listen(port, () => console.log(`Listening on port ${port}`));