import React from "react";

const CommentSection = ({ comments }) => {
    return (
        <div className="comment-section">
            {comments.map((comment) => (
                <div key={comment.id} className="comment">
                    <div className="comment-header">
                        <img src={comment.image} alt={comment.name} />
                        <div className="comment-info">
                            <p className="comment-name">{comment.name}</p>
                            <p className="comment-rating">Rating: {comment.rating}</p>
                        </div>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="replies">
                            <p>Replies:</p>
                            {comment.replies.map((reply) => (
                                <div key={reply.id} className="reply">
                                    <div className="reply-header">
                                        <img src={reply.image} alt={reply.name} />
                                        <div className="reply-info">
                                            <p className="reply-name">{reply.name}</p>
                                        </div>
                                    </div>
                                    <p className="reply-content">{reply.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CommentSection;
