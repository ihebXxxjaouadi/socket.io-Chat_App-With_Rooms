const express = require('express') ,
    path = require('path'),
    http = require('http'), 
    port = 3000;

const app = express() ;

// socket io 
const server = http.createServer(app) ,
    io = require('socket.io').listen(server); 

// set config to app
app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));

let namespaces = ['One', 'Two', 'Three']


app.get('/chat/:ns', (req, res) => {
    res.render('page', {namespaces: namespaces});
})

app.get('/room', (req, res) => {
    res.render('chooseRoom', {namespaces: namespaces});
})

// socket io


for (var i=0; i < namespaces.length ; i++) {
    const namespace = io.of('/' + namespaces[i]) 
    // console.log(namespace);
    
    
namespace.on('connection', (socket) => {
    // console.log("new connection", socket.id);

    
    var users = {};

    socket.on('Login', (name) => {
        users[socket.id] = name;
        let data = {
            from: 'server', 
            message: `${name} logged in` 
        }
        socket.broadcast.emit('message', data);
        console.log("new connection", users[socket.id]);

    })



    socket.on('chat message', (message) => {
        // console.log(message);
        let data = {
            from: users[socket.id],
            message: message
        }
        // socket.broadcast.emit('message', data);
        namespace.emit('message', data);
    })

    socket.on('typing message', () => {
        data = `${users[socket.id]} typing message`

        socket.broadcast.emit('show typing message', data)
        
    })

    socket.on('disconnect', () => {
        let data = {
            from: 'server', 
            message: `${users[socket.id]} disconnect` 
        }
        socket.broadcast.emit('message', data);
        console.log(users[socket.id], 'is disconnect');
        delete users[socket.id];
    })
    
})

}

// listen to server
server.listen(port, () => {
    console.log(`we are listenning on ${port}`);
    
})