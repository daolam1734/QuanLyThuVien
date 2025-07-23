import express from 'express';
import {
  createViolation,
  getViolations,
  deleteViolation,
  payViolation,
} from '../controllers/violation.controller.js';

const router = express.Router();

router.get('/', getViolations);
router.post('/', createViolation);
router.delete('/:id', deleteViolation);
router.put('/:id/pay', payViolation);

export default router;
