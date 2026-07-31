import mongoose from 'mongoose';

const borrowingRecordSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member ID is required'],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default: 14 days from borrowing
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['BORROWED', 'RETURNED', 'OVERDUE'],
        message: 'Status must be BORROWED, RETURNED, or OVERDUE',
      },
      default: 'BORROWED',
    },
  },
  {
    timestamps: true,
  }
);

const BorrowingRecord = mongoose.model('BorrowingRecord', borrowingRecordSchema);

export default BorrowingRecord;
