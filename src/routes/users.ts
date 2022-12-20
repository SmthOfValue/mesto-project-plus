import { Router } from 'express';
import {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getMyUserInfo,
} from '../controllers/users';
import { validateUserId, validateUserInfo, validateUserAvatar } from '../middlewares/validators';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMyUserInfo);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

export default router;
