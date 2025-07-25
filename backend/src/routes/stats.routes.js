import express from 'express';
import { getPublicStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/public', getPublicStats); // <- API này

export default router;
