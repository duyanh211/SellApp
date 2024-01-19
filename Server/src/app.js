const express = require("express")
const handlebars = require('express-handlebars')
const path = require('path')
const routes = require('./routes')
const cors = require('cors')
// const { createServer } = require('node:http');
// const { Server } = require('socket.io');

const app = express()
const port = 1144 

app.use(cors())
app.use(express.static(path.join(__dirname, "public")))
app.set('appName', 'My Express App');

// const server = createServer(app);
// const io = new Server(server);


// template engine
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        plus: (index, num) => index + num,
        cost: (number) => {
            if (number !== undefined && number !== null) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
                return number;
            }
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', ".\\src\\resources\\views");
// app.set('views', path.join(__dirname, 'resources\views'));
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))


const userGroups = {};

// Sự kiện khi người dùng tham gia nhóm chat mới
// io.on('connection', (socket) => {
//     console.log("user connection")
//   socket.on('join group', (magroup) => {
//     userGroups[magroup] = magroup;
//     socket.join(magroup); // Tham gia vào room tương ứng với nhóm chat
//   });

//   socket.on('chat message', (msg, magroup) => {
//     const groupId = userGroups[magroup];
//     if (groupId) {
//       io.to(groupId).emit('chat message', msg); // Gửi tin nhắn chỉ đến nhóm chat
//     }
//   });
// });

// end chat

routes(app)



const serverIp = '192.168.162.172'; // Địa chỉ IP của máy chủ bạn muốn lắng nghe

app.listen(port, serverIp, () => {
    console.log(`Server is running on ${serverIp}:${port}`);
});