require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const db = require('./models');
const routes = require('./routes');
const importRoutes = require('./routes/import');
const metricsRoutes = require('./routes/metrics');
const docsRoutes = require('./routes/docs');
const { setupSocket } = require('./socket/socketServer');
const logger = require('./utils/logger');
const { sanitizeBody } = require('./middlewares/sanitize');
const { initJobs } = require('./services/jobQueue');
const mbtilesService = require('./services/mbtilesService');

const eventController = require('./controllers/eventController');
const assetController = require('./controllers/assetController');
const deviceController = require('./controllers/deviceController');
const alertController = require('./controllers/alertController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  path: '/socket.io',
});

eventController.setIo(io);
assetController.setIo(io);
deviceController.setIo(io);
alertController.setIo(io);
setupSocket(io);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBody);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests', data: null },
}));

app.use('/api/v1/docs', docsRoutes);
app.use('/api/v1/import', importRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1', routes);

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ success: false, message: err.message, data: null });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connected');

    await db.sequelize.sync({ alter: process.env.NODE_ENV === 'developmentEE' });
    logger.info('Database synced');
    await mbtilesService.initializeMbtiles();
    await initJobs();

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};

start();

module.exports = { app, server, io };
