import { Router } from 'express';
import {
  getCards, deleteCardById, createCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { validateCardId, validateCardData } from '../middlewares/validators';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCardById);
router.post('/', validateCardData, createCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
