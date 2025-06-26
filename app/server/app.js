// import express from 'express';
// import cors from 'cors';
// import serverless from 'serverless-http'; 
// import jsonRoutes from './routes/jsonRoutes.js';
// import base64Routes from './routes/base64Routes.js';

// const app = express();


// app.use(cors());
// app.use(express.json());


// app.use('/api', jsonRoutes);
// app.use('/api', base64Routes);


// export const handler = serverless(app); 
// export default app; 



import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import jsonRoutes from './routes/jsonRoutes.js';
import base64Routes from './routes/base64Routes.js';

const app = express();

// 1. Middlewares
app.use(cors({
  origin: process.env.VERCEL_ENV 
    ? `https://${process.env.VERCEL_URL}` 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));

// 2. Routes
app.use('/api', jsonRoutes);
app.use('/api', base64Routes);

// 3. Vercel-specific error handlers
app.use((err, req, res, next) => {
  // Handle Vercel function timeouts
  if (err.message.includes('FUNCTION_INVOCATION_TIMEOUT')) {
    return res.status(504).json({
      code: 'FUNCTION_TIMEOUT',
      message: 'Request took too long to process'
    });
  }

  // Handle payload too large errors
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request body exceeds 10MB limit'
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    console.error('Database connection error:', err);
    return res.status(503).json({
      code: 'DATABASE_UNAVAILABLE',
      message: 'Database service interrupted'
    });
  }

  // Generic error handler
  console.error('Server Error:', err.stack);
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
});

// 4. 404 Handler (must be last)
app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Route not found'
  });
});

export const handler = serverless(app, {
  binary: ['image/*', 'application/pdf'],
  responseLimit: '10mb'
});

export default app;