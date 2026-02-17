import express from 'express';
import dotenv from 'dotenv';
import subjectRoutes from './routes/subjects';
import cors from 'cors';
import securityMiddleware from './middleware/security';

dotenv.config();

const app = express();
const PORT = process.env.PORT

if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL not set; CORS will block cross-origin requests');
}

app.use(express.json());
app.use(securityMiddleware)
app.use(cors())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/api/subjects', subjectRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server listen on port http:/localhost:${PORT}`)
})