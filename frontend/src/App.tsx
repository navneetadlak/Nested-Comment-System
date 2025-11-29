import React, { useState, useEffect } from 'react';
import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import type { Comment } from './types/comment';
import { commentApi } from './services/api';
import './App.css';

const App: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Hardcoded for demo - in real app, this would come from routing or props
  const POST_ID = 'demo-post-123';
  const CURRENT_USER_ID = 'user-1';

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const commentsData = await commentApi.getCommentsByPost(POST_ID);
      setComments(commentsData);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async (content: string, parentId: string | null = null) => {
    try {
      await commentApi.createComment({
        postId: POST_ID,
        userId: CURRENT_USER_ID,
        content,
        parentId,
      });
      await fetchComments(); // Refresh comments
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentApi.deleteComment(commentId);
      await fetchComments(); // Refresh comments
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Discussion Thread</h1>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')} className="dismiss-btn">×</button>
          </div>
        )}

        <div className="comment-section">
          <h2>Add a Comment</h2>
          <CommentForm
            onSubmit={handleAddComment}
            placeholder="What are your thoughts?"
            submitText="Post Comment"
          />

          <h2>Comments ({comments.length})</h2>
          {comments.length === 0 ? (
            <div className="no-comments">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <CommentList
              comments={comments}
              onAddReply={handleAddComment}
              onDeleteComment={handleDeleteComment}
              currentUserId={CURRENT_USER_ID}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;