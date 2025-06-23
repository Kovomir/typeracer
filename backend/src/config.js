import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default {
  // Server port (use environment variable or default to 3001)
  port: process.env.PORT || 3001,

  // Host to bind to (useful for deployment platforms)
  host: process.env.HOST || '0.0.0.0',

  // CORS allowed origins (comma separated list in env var)
  corsAllowedOrigins: process.env.CORS_ALLOWED_ORIGINS 
    ? process.env.CORS_ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000']
};
