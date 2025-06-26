import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http'; 
import jsonRoutes from './routes/jsonRoutes.js';
import base64Routes from './routes/base64Routes.js';

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api', jsonRoutes);
app.use('/api', base64Routes);


export const handler = serverless(app); 
export default app; 