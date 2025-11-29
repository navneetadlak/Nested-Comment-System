import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    postId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
CommentSchema.index({ postId: 1, parentId: 1 });
CommentSchema.index({ createdAt: -1 });

export default mongoose.model<IComment>('Comment', CommentSchema);