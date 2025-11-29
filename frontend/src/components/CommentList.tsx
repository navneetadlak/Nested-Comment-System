import React from 'react';
import CommentItem from './CommentItem';
import type { Comment } from '../types/comment';

interface CommentListProps {
  comments: Comment[];
  onAddReply: (content: string, parentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  currentUserId: string;
  depth?: number;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onAddReply,
  onDeleteComment,
  currentUserId,
  depth = 0
}) => {
  return (
    <div className={`comment-list ${depth > 0 ? 'nested' : ''}`}>
      {comments.map(comment => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onAddReply={onAddReply}
          onDeleteComment={onDeleteComment}
          currentUserId={currentUserId}
          depth={depth}
        />
      ))}
    </div>
  );
};

export default CommentList;