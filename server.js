const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Tọa độ mặc định (Hà Nội)
let currentLocation = { lat: 21.0285, lng: 105.8542 }; 

// 1. API GIẢ LẬP GPS: Trả về chuỗi NMEA (Tọa độ một điểm tại Hà Nội)
app.get('/api/mock-gps', (req, res) => {
    const nmeaString = "$GPGGA,045104.000,2101.7100,N,10551.2520,E,1,09,1.2,21.6,M,-22.5,M,,0000*62\r\n";
    res.send(nmeaString);
});

// 2. API NHẬN DỮ LIỆU: ESP32 sẽ gửi JSON tọa độ đã phân tích vào đây
app.post('/api/location', (req, res) => {
    console.log("ESP32 vua gui toa do moi:", req.body);
    if(req.body.lat && req.body.lng) {
        currentLocation = req.body;
    }
    res.sendStatus(200);
});

// 3. API CHO WEB BẢN ĐỒ: Lấy tọa độ hiện tại để hiển thị
app.get('/api/current-location', (req, res) => {
    res.json(currentLocation);
});

// Phục vụ file giao diện Web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server dang chay tai http://localhost:3000');
});