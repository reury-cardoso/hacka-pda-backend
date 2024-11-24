import express from 'express';
import { createHotel, updateHotel, getAllHotels, getAllHotelsByCategory, getAllHotelsByCategoryAndCity, getAllHotelsByCity} from '../controllers/HotelController.js';

const router = express.Router();

router.post('/hotels', createHotel);
router.put('/hotels/:id', updateHotel);
router.get('/hotels', getAllHotels);
router.get('/hotels/category/:category', getAllHotelsByCategory);
router.get('/hotels/city/:city', getAllHotelsByCity);
router.get('/hotels/category/:category/city/:city', getAllHotelsByCategoryAndCity);


export default router;