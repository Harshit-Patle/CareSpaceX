let express = require('express');
let app = express();
let cors = require('cors');
let dotenv = require('dotenv');
let session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);


const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',  
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true, 
    },
});

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(cookieParser());

var corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));




app.get('/', (req, res) => {
    res.send("Testing phase");
});



io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('sendMessage', async (msg) => {
        console.log(msg);
        try {
            const { sender, recipient, timestamp, text } = msg;
            console.log(text);
            
            const newMessage = new Chart({
                sender,
                recipient,
                timestamp,
                message: text.text,
            });
            await newMessage.save();
            socket.emit('messageStatus', { success: true, message: 'Message saved successfully' });
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('messageStatus', { success: false, message: 'Failed to save message' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
