import AgentAPI from 'apminsight';
AgentAPI.config();
import express from 'express';
import dotenv from 'dotenv';
import subjectRoutes from './routes/subjects';
import cors from 'cors';
import securityMiddleware from './middleware/security';
import {toNodeHandler} from 'better-auth/node'
import { auth } from './lib/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT

if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL not set; CORS will block cross-origin requests');
}

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json());
app.use(securityMiddleware)

app.use('/api/subjects', subjectRoutes)
app.all('/api/auth/*splat', toNodeHandler(auth));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server listen on port http:/localhost:${PORT}`)
})