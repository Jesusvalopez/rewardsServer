import express from 'express';

import { getCoupons, createCoupon, updateCoupon, deleteCoupon} from '../controllers/coupons.js'

const router = express.Router();

router.get('/', getCoupons);
router.post('/', createCoupon);
router.patch('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

export default router;