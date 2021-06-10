const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors:{
        origin: "http://127.0.0.1:8000",
        methods: ["GET", "POST"]
    }
});

const users = {};

http.listen(8005 , () =>{
    console.log('8005 portu dinleniyor..!')
});

io.sockets.on('connection', function (socket){ 
    socket.on('kullanici' , function(data,callback){
        if(data in users){
            callback(false);
        } else{
            callback(true)
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateUsers();
        }
    });

    function updateUsers(){
        io.sockets.emit('users', Object.keys(users));
    }

    updateUsers();

    socket.on('gonder', function (data) {
       io.sockets.emit('mesaj', {msg: data, nick: socket.nickname});
    });

    socket.on('disconnect', () => {
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateUsers();
        // io.sockets.emit('cikisYapanlar', socket.nickname);
    });

    socket.on('cıkısYap' ,(data,callback) =>{
        delete users[data];
        updateUsers();
        io.sockets.emit('cikisYapanlar', socket.nickname);
        callback(true);
    });
});