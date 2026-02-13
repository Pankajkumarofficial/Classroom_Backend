import express from 'express';
import dotenv from 'dotenv';
import subjectRoutes from './routes/subjects';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT

app.use(express.json());
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