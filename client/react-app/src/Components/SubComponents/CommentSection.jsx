/* eslint-disable react/prop-types */
import React, { useState } from "react";

const ReplyForm = ({ onSubmit, parentCommentId }) => {
    const [replyText, setReplyText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(replyText, parentCommentId);
        setReplyText(''); // Clear the textarea after submitting
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                placeholder="Write a reply..."
            />
            <button type="submit">Submit Reply</button>
        </form>
    );
};

const NewCommentForm = ({ onSubmit }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(commentText);
        setCommentText(''); // Clear the textarea after submitting
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                placeholder="Write a comment..."
            />
            <button type="submit">Submit Comment</button>
        </form>
    );
};


const Comment = ({ comment, replies, showReplyButton, onReplySubmit }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    const handleReplyClick = () => {
        setShowReplyForm(true);
    };

    const handleCancelReply = () => {
        setShowReplyForm(false);
    };

    return (
        <div className="comment">
            <div className="comment-header">
                {/* Uncomment and use the following line if images are available */}
                {<img src={comment.user.profile.profile_picture} alt={comment.user.username} className="comment-profile-picture" />}
                <div className="comment-info">
                    <p className="comment-username">{comment.user.username}</p>
                    {comment.user_rate && comment.user_rate.rate_point && (
                        <p className="comment-rating">Rating: {comment.user_rate.rate_point}</p>
                    )}

                </div>
            </div>
            <p className="comment-text">{comment.text}</p>
            {showReplyButton && <button onClick={handleReplyClick} className="reply-button">Reply</button>}
            {showReplyForm && (
                <>
                    <ReplyForm onSubmit={onReplySubmit} parentCommentId={comment.id} />
                    <button onClick={handleCancelReply} className="cancel-reply-button">Cancel</button>
                </>
            )}
            {replies && replies.length > 0 && (
                <div className="replies">
                    {replies.map(reply => (
                        <Comment key={reply.id} comment={reply} replies={[]} showReplyButton={false} onReplySubmit={onReplySubmit} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection = ({ comments, onReplySubmit, onCommentSubmit }) => {
    const topLevelComments = comments.filter(comment => comment.parent_comment === null);
    const repliesMap = comments
        .filter(comment => comment.parent_comment !== null)
        .reduce((acc, comment) => {
            const parentID = comment.parent_comment;
            acc[parentID] = acc[parentID] || [];
            acc[parentID].push(comment);
            return acc;
        }, {});

    return (
        <div className="comment-section">
            <NewCommentForm  onSubmit={onCommentSubmit} />
            {topLevelComments.map(comment => (
                <Comment 
                    key={comment.id} 
                    comment={comment} 
                    replies={repliesMap[comment.id]} 
                    showReplyButton={true} 
                    onReplySubmit={onReplySubmit}
                />
            ))}
        </div>
    );
};

export default CommentSection;
