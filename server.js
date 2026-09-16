const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
// Cho phép server load trực tiếp các file .html trong thư mục hiện tại
app.use(express.static(__dirname)); 

io.on('connection', (socket) => {
    console.log('🔗 Thiết bị kết nối:', socket.id);

    // Kênh 1: Hứng tọa độ từ Simulator và ném sang Bản đồ 2D
    socket.on('send-telemetry', (payload) => {
        io.emit('telemetry-updated', payload); 
    });

    // Kênh 2: Xử lý khung Chat AI
    socket.on('ask-ai', (data) => {
        console.log(`[CHAT] Khách hỏi: ${data.question}`);
        // Giả lập độ trễ AI suy nghĩ 1.5s
        setTimeout(() => {
            socket.emit('ai-answer', { 
                reply: `[HỆ THỐNG AI]: Bạn vừa hỏi về "${data.question}". Hệ thống RAG sẽ được tích hợp vào đây để trích xuất thông tin cổ vật trả lời bạn.` 
            });
        }, 1500);
    });

    socket.on('disconnect', () => {
        console.log('❌ Ngắt kết nối:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('🚀 Server đang chạy tại http://localhost:3000');
});