import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaUser, FaTrash } from 'react-icons/fa';
import './CommentSection.css';

const CommentSection = ({ experienceId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/comments/experience/${experienceId}`);
        setComments(res.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [experienceId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.info('Please login to leave a comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      const res = await api.post('/api/comments', {
        text: newComment,
        experienceId,
      });
      
      setComments([res.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/api/comments/${commentId}`);
        setComments(comments.filter(comment => comment._id !== commentId));
        toast.success('Comment deleted');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  return (
    <div className="comments-section">
      <h2>Comments</h2>
      
      <div className="comment-form-container">
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "Share your thoughts..." : "Login to leave a comment"}
            disabled={!user}
            rows="3"
          ></textarea>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!user}
          >
            Post Comment
          </button>
        </form>
      </div>
      
      <div className="comments-list">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-avatar">
                {comment.user.profilePicture ? (
                  <img 
                    src={comment.user.profilePicture} 
                    alt={comment.user.name}
                  />
                ) : (
                  <div className="default-avatar">
                    <FaUser />
                  </div>
                )}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <h4>{comment.user.name}</h4>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p>{comment.text}</p>
                {user && user._id === comment.user._id && (
                  <button 
                    className="delete-comment-btn"
                    onClick={() => handleCommentDelete(comment._id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
