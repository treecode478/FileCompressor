import mongoose from 'mongoose';

const { Schema } = mongoose;

// User schema is central to multiple modules (posts, chat, QA).
// We keep it focused and use separate collections (e.g. Follow) for many-to-many relations at scale.

const locationSchema = new Schema(
  {
    country: { type: String, default: 'India' },
    state: { type: String, index: true },
    district: { type: String },
    village: { type: String }
  },
  { _id: false }
);

const expertVerificationSchema = new Schema(
  {
    isVerified: { type: Boolean, default: false },
    documents: [
      {
        type: {
          type: String,
          enum: ['aadhar', 'degree', 'license', 'other'],
          required: true
        },
        url: { type: String, required: true }, // Cloudinary URL
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    verifiedAt: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // optional for pure phone-OTP users

    role: {
      type: String,
      enum: ['farmer', 'expert', 'admin'],
      default: 'farmer',
      index: true
    },

    expert: expertVerificationSchema,

    avatarUrl: { type: String },
    coverUrl: { type: String },
    bio: { type: String, maxlength: 300 },

    location: locationSchema,
    languages: [{ type: String }],

    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    // Simple versioning mechanism to invalidate refresh tokens on logout-all or security events.
    tokenVersion: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

userSchema.index({ role: 1, 'location.state': 1 });

const User = mongoose.model('User', userSchema);

export default User;

