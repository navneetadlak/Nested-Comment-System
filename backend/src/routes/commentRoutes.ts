import { Router } from 'express';
import { CommentController } from '../controllers/commentController';

const router = Router();
const commentController = new CommentController();

// Input validation middleware
const validateCreateComment = (req: any, res: any, next: any) => {
  const { postId, userId, content } = req.body;

  if (!postId || !userId || !content) {
    return res.status(400).json({
      error: 'Missing required fields: postId, userId, content'
    });
  }

  if (content.trim().length === 0) {
    return res.status(400).json({
      error: 'Content cannot be empty'
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      error: 'Content too long (max 1000 characters)'
    });
  }

  next();
};

const validateUpdateComment = (req: any, res: any, next: any) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      error: 'Content is required and cannot be empty'
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      error: 'Content too long (max 1000 characters)'
    });
  }

  next();
};

router.post('/comments', validateCreateComment, commentController.createComment.bind(commentController));
router.get('/comments/:postId', commentController.getCommentsByPost.bind(commentController));
router.put('/comments/:id', validateUpdateComment, commentController.updateComment.bind(commentController));
router.delete('/comments/:id', commentController.deleteComment.bind(commentController));

export default router;