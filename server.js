
import express from "express";
import { Server } from 'socket.io';
import { conn } from './db.js';
const app = express();
const port = 4000;
// const wifiIp = "192.168.1.4"
var server = app.listen(port, () => {
    console.log(`Server is running ${port}`);
});


const io = new Server(server, {
    cors: { origin: "*" }
});

app.get("/sdf", async (req, resp) => {
    let queryForFetch = "SELECT * FROM blogs WHERE 1";
    let response = await conn(queryForFetch);
    console.log("response", response);
    resp.status(200).json(response);
})

io.on('connection', (socket) => {
    console.log('user conneted');
    //typing events
    socket.on('typing',(type)=>{
        const room = type.room;
        socket.join(room);
        console.log(type);
        io.to(room).emit('typingon',type);
    });
    //send message data
    socket.on('newmessage', (data) => {
        const room = data.conversation;
        var time = new Date();
        const message = data.message;
        const img = data.img;
        const sender_id = data.sender_id;
        const message_type = data.messageType;
        socket.join(room);  
        const datas = {
            conversation: room,
            message: message,
            img:img,
            sender_id: sender_id,
            message_type: message_type,
        };

        if (typeof message !== 'undefined') {
            const values = [room, sender_id, message, message_type];
            const insertQuery = 'INSERT INTO conversation_chat (conversation_id, sender_id, message,message_type) VALUES (?, ?, ?,?)';
            conn.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error('Error inserting message:', err);
                    return;
                }
            });
            console.log("result message add successfully");
            console.log(datas);
            io.to(room).emit('recivemessage', datas);
        }else{
            console.log("Message is undefined");
        }

    });
    socket.on('disconnect', (socket) => {
        console.log('Disconnect');
    });
});

