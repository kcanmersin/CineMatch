/* eslint-disable react/prop-types */
import { useState } from "react";
import "./CommentSection.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ReplyForm = ({ onSubmit, onCancel, parentCommentId }) => {
    const [replyText, setReplyText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(replyText, parentCommentId);
        setReplyText(''); // Clear the textarea after submitting
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <Form onSubmit={handleSubmit} className="reply-form">
            <Form.Group controlId="replyText">
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                />
            </Form.Group>
            <Button type="submit" variant="success" className="submit-cancel-reply-buttons">
                Submit Reply
            </Button>
            <Button variant="danger" onClick={handleCancel} className="submit-cancel-reply-buttons">
                Cancel
            </Button>
        </Form>
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
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentText">
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                />
            </Form.Group>
            <Button type="submit" variant="success" className="submit-comment-button">
                Submit Comment
            </Button>
        </Form>
    );
};

const Comment = ({ comment, replies, showReplyButton, onReplySubmit, onDeleteComment, username}) => {
    const isUserComment = comment.user.username === username;
    const [showReplyForm, setShowReplyForm] = useState(false);


    const handleDeleteClick = () => {
        onDeleteComment(comment.id);
    };

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
                {/*<img src={comment.user.profile.profile_picture} alt={comment.user.username} className="comment-profile-picture" />*/}
                <div className="comment-info">
                    <p className="comment-username">{comment.user.username}
                    {comment.user_rate && comment.user_rate.rate_point && (
                        <span className="comment-rating">{comment.user_rate.rate_point}<span className="faint-text">/10</span></span>
                    )}
                    </p>

                </div>
            </div>
            <p className="comment-text">{comment.text}</p>
            {showReplyButton && (
                <Button variant="success" onClick={handleReplyClick} className="reply-button">
                    Reply
                </Button>
            )}
            {isUserComment && (
                <Button variant="danger" onClick={handleDeleteClick} className="delete-button">
                    Delete
                </Button>
            )}

            {showReplyForm && (
                <ReplyForm onSubmit={onReplySubmit} onCancel={handleCancelReply} parentCommentId={comment.id} />
            )}

            {replies && replies.length > 0 && (
                <div className="replies">
                    {replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            replies={[]} // Assuming replies of replies are not handled
                            showReplyButton={true}
                            onReplySubmit={onReplySubmit}
                            onDeleteComment={onDeleteComment}
                            username={username}
                        />
                    ))}
                </div>
            )}
            
        </div>
    );
};

const CommentSection = ({ comments, onReplySubmit, onCommentSubmit, onDeleteComment, username }) => {
    const topLevelComments = comments.filter((comment) => comment.parent_comment === null);
    const repliesMap = comments
        .filter((comment) => comment.parent_comment !== null)
        .reduce((acc, comment) => {
            const parentID = comment.parent_comment;
            acc[parentID] = acc[parentID] || [];
            acc[parentID].push(comment);
            return acc;
        }, {});

    return (
        <div className="comment-section">
            {topLevelComments.map((comment) => (
                <Comment key={comment.id} comment={comment} replies={repliesMap[comment.id]} showReplyButton={true} onReplySubmit={onReplySubmit} onDeleteComment={onDeleteComment}  username={username} />
            ))}
            <NewCommentForm onSubmit={onCommentSubmit} />
        </div>
    );
};

export default CommentSection;
