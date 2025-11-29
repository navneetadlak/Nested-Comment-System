import { Types } from 'mongoose';
import Comment, { IComment } from '../models/Comment';
import { CommentTreeNode } from '../types/comment';

export class CommentService {
  // Create a new comment or reply
  async createComment(commentData: {
    postId: string;
    userId: string;
    content: string;
    parentId?: string | null;
  }): Promise<IComment> {
    const { postId, userId, content, parentId = null } = commentData;

    // Remove ObjectId validation to allow string IDs
    if (!postId || postId.trim().length === 0) {
      throw new Error('postId is required');
    }

    if (!userId || userId.trim().length === 0) {
      throw new Error('userId is required');
    }

    if (!content || content.trim().length === 0) {
      throw new Error('content is required');
    }

    // Validate parent comment exists if parentId is provided
    if (parentId && parentId.trim().length > 0) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
      if (parentComment.postId.toString() !== postId) {
        throw new Error('Parent comment does not belong to the same post');
      }
    }

    const comment = new Comment({
      postId: postId, // Store as string directly
      userId: userId, // Store as string directly
      content: content.trim(),
      parentId: parentId && parentId.trim().length > 0 ? parentId : null,
    });

    return await comment.save();
  }

  // Get nested comments for a post with O(n) efficiency
  async getNestedComments(postId: string): Promise<CommentTreeNode[]> {
    if (!postId || postId.trim().length === 0) {
      throw new Error('postId is required');
    }

    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .lean();

    // Create a map for O(1) lookups
    const commentMap = new Map<string, CommentTreeNode>();
    const rootComments: CommentTreeNode[] = [];

    // First pass: create all nodes
    comments.forEach(comment => {
      const commentNode: CommentTreeNode = {
        ...comment,
        _id: comment._id as Types.ObjectId,
        postId: comment.postId,
        userId: comment.userId,
        parentId: comment.parentId,
        children: [],
      };
      commentMap.set(comment._id.toString(), commentNode);
    });

    // Second pass: build the tree
    comments.forEach(comment => {
      const commentNode = commentMap.get(comment._id.toString())!;

      if (!comment.parentId) {
        rootComments.push(commentNode);
      } else {
        const parentNode = commentMap.get(comment.parentId.toString());
        if (parentNode) {
          parentNode.children.push(commentNode);
        }
      }
    });

    return rootComments;
  }

  // Update a comment
  async updateComment(commentId: string, content: string): Promise<IComment | null> {
    if (!commentId || commentId.trim().length === 0) {
      throw new Error('commentId is required');
    }

    return await Comment.findByIdAndUpdate(
      commentId,
      {
        content: content.trim(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
  }

  // Delete a comment and its children recursively
  async deleteComment(commentId: string): Promise<void> {
    if (!commentId || commentId.trim().length === 0) {
      throw new Error('commentId is required');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Recursively find all child comments
    const deleteChildren = async (parentId: string) => {
      const children = await Comment.find({ parentId });
      for (const child of children) {
        await deleteChildren(child._id.toString());
        await Comment.findByIdAndDelete(child._id);
      }
    };

    await deleteChildren(commentId);
    await Comment.findByIdAndDelete(commentId);
  }

  // Get single comment
  async getCommentById(commentId: string): Promise<IComment | null> {
    if (!commentId || commentId.trim().length === 0) {
      throw new Error('commentId is required');
    }

    return await Comment.findById(commentId);
  }
}