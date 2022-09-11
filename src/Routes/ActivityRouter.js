import { income, outcome, balance } from '../Controllers/ActivityController.js';
import { Router } from 'express';
import validateUser from '../Middleware/AuthMiddleware.js';

const router = Router();

router.post('/income', validateUser, income);
router.post('/outcome', validateUser, outcome);
router.get('/balance', validateUser, balance);

export default router;