const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');

const routes = require('./routes');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');
const env = require('./config/env');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ['https://unixange.vercel.app', 'http://localhost:5173'],
    credentials: true
  })
);

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
