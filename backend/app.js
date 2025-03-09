let express = require('express');
let app = express();
let sign = require('./route/signup');
let cors = require('cors');
const cookieParser = require('cookie-parser');
let dotenv = require('dotenv');
let session = require('express-session');
let connectdb = require('./config/db.js');
let details = require('./route/detail');
let loading = require('./route/doctorsearch');
let payment = require('./route/payment');
const hospital = require('./route/bed');
const http = require('http');
const server = http.createServer(app);
const Chart = require('./models/chat.js');
const chat = require('./route/chat.js');
const list = require('./route/appointment.js');
const profile = require('./route/profile.js');
const inventry = require('./route/inventry.js');
const history = require('./route/history.js');
const medicine = require('./route/medication.js');
let approval = require('./route/approval.js');
let search = require('./route/searchhistory.js');
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

dotenv.config();
connectdb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(cookieParser());

var corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use('/sign', sign);
app.use('/add',inventry)
app.use('/detail', details);
app.use('/loading', loading);
app.use('/payment', payment);
app.use('/hospital', hospital);
app.use('/history', chat);
app.use('/list', list);
app.use('/profile', profile);
app.use('/history', history);
app.use('/medicine', medicine);
app.use('/admin', approval)
app.use('/search', search);


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
