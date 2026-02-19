import express from 'express';
import { classController } from '../controllers/classesController.js';

const router = express.Router();

router.post('/', classController)

export default router;