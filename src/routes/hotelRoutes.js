import express from 'express';
import { createHotel, updateHotel, getAllHotels } from '../controllers/HotelController.js';

const router = express.Router();

router.post('/hotels', createHotel);
router.put('/hotels/:id', updateHotel);
router.get('/hotels', getAllHotels);

export default router;