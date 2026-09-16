const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path'); // Thêm thư viện quản lý đường dẫn file

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());

// --- LỆNH MỚI: MỞ QUẦY GET TRANG CHỦ ---
app.get('/', (req, res) => {
    // Trả về file index.html nằm cùng thư mục với server.js
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Tọa độ trung tâm mặc định
let currentLocation = { lat: 21.0253, lng: 105.8465 };

io.on('connection', (socket) => {
    console.log('🔗 Thiết bị vừa kết nối:', socket.id);
    socket.emit('location-updated', currentLocation);

    socket.on('send-gps', (data) => {
        currentLocation = data;
        // Bắn tọa độ đi cho tất cả những ai đang xem bản đồ
        io.emit('location-updated', currentLocation); 
    });

    socket.on('disconnect', () => {
        console.log('❌ Đã ngắt kết nối');
    });
});

server.listen(3000, () => {
    console.log('🚀 Server đang chạy. Mở http://localhost:3000 để xem bản đồ.');
});