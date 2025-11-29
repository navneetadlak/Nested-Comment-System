import React, { useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import type { Comment } from '../types/comment';

interface CommentItemProps {
    comment: Comment;
    onAddReply: (content: string, parentId: string) => void;
    onDeleteComment: (commentId: string) => void;
    currentUserId: string;
    depth: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onAddReply,
    onDeleteComment,
    currentUserId,
    depth
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleReply = (content: string) => {
        onAddReply(content, comment._id);
        setIsReplying(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canDelete = comment.userId === currentUserId;

    return (
        <div
            className={`comment-item ${depth > 0 ? 'reply' : ''}`}
            style={{ marginLeft: `${depth * 30}px` }}
        >
            <div className="comment-header">
                <span className="user-id">User {comment.userId}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>

            <div className="comment-content">
                {comment.content}
            </div>

            <div className="comment-actions">
                <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="action-btn reply-btn"
                >
                    {isReplying ? 'Cancel' : 'Reply'}
                </button>

                {comment.children.length > 0 && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="action-btn collapse-btn"
                    >
                        {isCollapsed ? `Show Replies (${comment.children.length})` : 'Hide Replies'}
                    </button>
                )}

                {canDelete && (
                    <button
                        onClick={() => onDeleteComment(comment._id)}
                        className="action-btn delete-btn"
                    >
                        Delete
                    </button>
                )}
            </div>

            {isReplying && (
                <div className="reply-form">
                    <CommentForm
                        onSubmit={handleReply}
                        placeholder="Write your reply..."
                        submitText="Post Reply"
                        onCancel={() => setIsReplying(false)}
                    />
                </div>
            )}

            {comment.children.length > 0 && !isCollapsed && (
                <div className="replies">
                    <CommentList
                        comments={comment.children}
                        onAddReply={onAddReply}
                        onDeleteComment={onDeleteComment}
                        currentUserId={currentUserId}
                        depth={depth + 1}
                    />
                </div>
            )}
        </div>
    );
};

export default CommentItem;