const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();

const { connectDB } = require('./config/database');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

app.set('io', io);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/projects',      require('./routes/projects'));
app.use('/api/tasks',         require('./routes/tasks'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dashboard',     require('./routes/dashboard'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Zolar API Running!',
    time: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

io.on('connection', (socket) => {
  socket.on('join_room', (userId) => socket.join(`user_${userId}`));
  socket.on('disconnect', () => console.log('disconnected'));
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log('================================');
      console.log(`✅ Database: Connected`);
      console.log(`🚀 Server:   http://localhost:${PORT}`);
      console.log(`📡 Health:   http://localhost:${PORT}/api/health`);
      console.log('================================');
    });
  } catch (error) {
    console.error('Failed to start:', error.message);
    process.exit(1);
  }
}

start();