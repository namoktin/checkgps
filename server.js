const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Cấp quyền nhận/gửi từ mọi nguồn (Chống lỗi CORS)
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Cho phép Render truy cập file HTML của bạn (nếu bạn để index.html cùng thư mục với server.js)
app.use(express.static(__dirname)); 

io.on('connection', (socket) => {
  console.log('🔗 Một thiết bị vừa kết nối:', socket.id);

  // 1. LẮNG NGHE SỰ KIỆN TỪ ESP32
  socket.on('send-telemetry', (data) => {
    // console.log("Hứng dữ liệu từ ESP32:", data);
    
    // 2. PHÁT LẠI SỰ KIỆN CHO TRANG WEB BẢN ĐỒ
    // Lệnh này vứt dữ liệu cho TẤT CẢ các thiết bị đang kết nối (trừ thằng ESP32 vừa gửi lên)
    socket.broadcast.emit('telemetry-update', data); 
  });

  socket.on('disconnect', () => {
    console.log('❌ Một thiết bị đã ngắt kết nối:', socket.id);
  });
});

const PORT = process.env.PORT || 3000; // Render sẽ tự chọn port 443 khi push lên môi trường Production
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});