// import express from 'express';
// import cors from 'cors';
// import jsonRoutes from './routes/jsonRoutes.js';
// import base64Routes from './routes/base64Routes.js';

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api', jsonRoutes);
// app.use('/api', base64Routes);

// export default app;


import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http'; // Add this
import jsonRoutes from './routes/jsonRoutes.js';
import base64Routes from './routes/base64Routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', jsonRoutes);
app.use('/api', base64Routes);

// Export for Vercel
export const handler = serverless(app); // For Vercel
export default app; // For local development