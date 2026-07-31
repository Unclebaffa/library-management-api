import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    membershipId: {
      type: String,
      required: [true, 'Membership ID is required'],
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        message: 'Status must be ACTIVE, INACTIVE, or SUSPENDED',
      },
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook: generate unique membershipId if not provided during creation
memberSchema.pre('validate', function (next) {
  if (!this.membershipId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.membershipId = `MEM-${timestamp}-${random}`;
  }
  next();
});

const Member = mongoose.model('Member', memberSchema);

export default Member;
