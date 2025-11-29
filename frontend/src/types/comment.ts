export interface Comment {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  children: Comment[];
}

export interface CreateCommentRequest {
  postId: string;
  userId: string;
  content: string;
  parentId?: string | null;
}