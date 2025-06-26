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

// 1. Middlewares (First)
app.use(cors());
app.use(express.json());

// 2. Routes (Middle)
app.use('/api', jsonRoutes);
app.use('/api', base64Routes);

// 3. Error Handler (LAST - after all routes/middlewares)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serverless export
export const handler = serverless(app);
export default app;