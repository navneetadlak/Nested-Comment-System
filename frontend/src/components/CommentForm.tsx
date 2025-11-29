import React, { useState } from 'react';

interface CommentFormProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    submitText?: string;
    onCancel?: () => void;
    initialValue?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
    onSubmit,
    placeholder = 'Write a comment...',
    submitText = 'Submit',
    onCancel,
    initialValue = ''
}) => {
    const [content, setContent] = useState(initialValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    const handleCancel = () => {
        setContent('');
        onCancel?.();
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="comment-textarea"
                required
            />
            <div className="form-actions">
                {onCancel && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={!content.trim()}
                    className="submit-btn"
                >
                    {submitText}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;