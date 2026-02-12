import mongoose from 'mongoose';

const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    sizeBytes: { type: Number }, // validated at API layer (<= 20MB)
    durationSeconds: { type: Number } // for videos if needed
  },
  { _id: false }
);

const voiceSchema = new Schema(
  {
    url: { type: String, required: true }, // Cloudinary or other storage URL
    transcript: { type: String } // filled by Web Speech / Google STT client-side or via separate service
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, maxlength: 2000 },
    media: mediaSchema,
    voice: voiceSchema,
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'voice'],
      default: 'text',
      index: true
    },
    hashtags: [{ type: String, index: true }],
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],

    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },

    isReported: { type: Boolean, default: false },
    reportsCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;

