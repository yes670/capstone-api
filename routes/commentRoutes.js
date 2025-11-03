// In routes/commentRoutes.js

import express from 'express';
const router = express.Router({ mergeParams: true }); 

// -------------  修改这里：将 getCommentsForPost 改为 getComments  -------------
import { getComments, createComment } from '../controllers/commentController.js';
// --------------------------------------------------------------------------

import { protect } from '../middleware/authMiddleware.js';

// -------------  同时修改这里，使用正确的函数名  -------------
router.route('/').get(getComments).post(protect, createComment);
// --------------------------------------------------------

export default router;