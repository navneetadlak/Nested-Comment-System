import { Types } from 'mongoose';

export interface CreateCommentRequest {
  postId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}

export interface CommentResponse {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  children: CommentResponse[];
}

export interface CommentTreeNode {
  _id: Types.ObjectId;
  postId: string; // Changed to string
  userId: string; // Changed to string
  content: string;
  parentId: string | null; // Changed to string
  createdAt: Date;
  children: CommentTreeNode[];
}