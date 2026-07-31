import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: [true, 'Publication year is required'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies count is required'],
      min: [1, 'Total copies must be at least 1'],
    },
    availableCopies: {
      type: Number,
      required: [true, 'Available copies count is required'],
      min: [0, 'Available copies cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: set availableCopies equal to totalCopies on creation if not explicitly provided
bookSchema.pre('validate', function (next) {
  if (this.isNew && (this.availableCopies === undefined || this.availableCopies === null)) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
