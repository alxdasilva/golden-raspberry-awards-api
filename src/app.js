import express from 'express';
import awardsRoutes from './routes/awards.routes.js';

const app = express();

app.use(express.json());
app.use('/awards', awardsRoutes);

export default app;
