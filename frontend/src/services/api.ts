import axios from 'axios';
import type { Comment, CreateCommentRequest } from '../types/comment';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const commentApi = {
  // Get nested comments for a post
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments/${postId}`);
    return response.data;
  },

  // Create a new comment or reply
  createComment: async (commentData: CreateCommentRequest): Promise<Comment> => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};