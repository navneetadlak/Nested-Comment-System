import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';
import { CreateCommentRequest, CommentResponse } from '../types/comment.js';

const commentService = new CommentService();

export class CommentController {
  // POST /comments
  async createComment(req: Request, res: Response) {
    try {
      const { postId, userId, content, parentId = null }: CreateCommentRequest = req.body;

      if (!postId || !userId || !content) {
        return res.status(400).json({
          error: 'Missing required fields: postId, userId, content',
        });
      }

      const comment = await commentService.createComment({
        postId,
        userId,
        content,
        parentId,
      });

      res.status(201).json({
        _id: comment._id,
        postId: comment.postId,
        userId: comment.userId,
        content: comment.content,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to create comment',
      });
    }
  }

  // GET /comments/:postId
  async getCommentsByPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }

      const comments = await commentService.getNestedComments(postId);
      
      // Convert to response format
      const formatComment = (comment: any): CommentResponse => ({
        _id: comment._id.toString(),
        postId: comment.postId.toString(),
        userId: comment.userId.toString(),
        content: comment.content,
        parentId: comment.parentId ? comment.parentId.toString() : null,
        createdAt: comment.createdAt.toISOString(),
        children: comment.children.map(formatComment),
      });

      const formattedComments = comments.map(formatComment);

      res.json(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to fetch comments',
      });
    }
  }

  // PUT /comments/:id
  async updateComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const updatedComment = await commentService.updateComment(id, content);

      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.json({
        _id: updatedComment._id,
        postId: updatedComment.postId,
        userId: updatedComment.userId,
        content: updatedComment.content,
        parentId: updatedComment.parentId,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to update comment',
      });
    }
  }

  // DELETE /comments/:id
  async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await commentService.deleteComment(id);

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to delete comment',
      });
    }
  }
}