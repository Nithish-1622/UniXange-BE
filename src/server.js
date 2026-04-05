const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`UniXchange API running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
