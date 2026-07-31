import BorrowingRecord from '../models/BorrowingRecord.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Borrow a book (Create borrowing record)
 * @route   POST /api/v1/borrowings
 * @access  Public
 */
export const borrowBook = asyncHandler(async (req, res) => {
  const { memberId, bookId } = req.body;

  // 1. Verify Member exists and has ACTIVE status
  const member = await Member.findById(memberId);
  if (!member) {
    throw new ApiError(404, `Member with ID '${memberId}' not found`);
  }
  if (member.status !== 'ACTIVE') {
    throw new ApiError(
      400,
      `Member '${member.name}' is currently ${member.status}. Only ACTIVE members can borrow books`
    );
  }

  // 2. Verify Book exists and copies are available
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, `Book with ID '${bookId}' not found`);
  }
  if (book.availableCopies <= 0) {
    throw new ApiError(400, 'Book currently unavailable');
  }

  // 3. Prevent duplicate active borrowings of the same book by the same member
  const existingBorrow = await BorrowingRecord.findOne({
    memberId,
    bookId,
    status: 'BORROWED',
  });
  if (existingBorrow) {
    throw new ApiError(400, 'Member already has an active borrowing record for this book');
  }

  // 4. Decrement availableCopies count on the Book
  book.availableCopies -= 1;
  await book.save();

  // 5. Create Borrowing Record document
  const borrowingRecord = await BorrowingRecord.create({
    memberId,
    bookId,
    borrowDate: new Date(),
    status: 'BORROWED',
  });

  // Populate reference details for return payload
  const populatedRecord = await BorrowingRecord.findById(borrowingRecord._id)
    .populate('memberId', 'name email membershipId')
    .populate('bookId', 'title author ISBN');

  return res
    .status(201)
    .json(new ApiResponse(201, populatedRecord, 'Book borrowed successfully'));
});

/**
 * @desc    Return a borrowed book
 * @route   PUT /api/v1/borrowings/:id/return
 * @access  Public
 */
export const returnBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const borrowing = await BorrowingRecord.findById(id);
  if (!borrowing) {
    throw new ApiError(404, `Borrowing record with ID '${id}' not found`);
  }

  if (borrowing.status === 'RETURNED') {
    throw new ApiError(400, 'Book has already been returned');
  }

  // Update borrowing record
  borrowing.returnDate = new Date();
  borrowing.status = 'RETURNED';
  await borrowing.save();

  // Increment availableCopies count on the Book
  await Book.findByIdAndUpdate(borrowing.bookId, {
    $inc: { availableCopies: 1 },
  });

  const updatedRecord = await BorrowingRecord.findById(id)
    .populate('memberId', 'name email membershipId')
    .populate('bookId', 'title author ISBN');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedRecord, 'Book returned successfully'));
});

/**
 * @desc    Get all borrowing records with populated references, filtering & pagination
 * @route   GET /api/v1/borrowings
 * @access  Public
 */
export const getAllBorrowings = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const { status, memberId, bookId } = req.query;
  const filter = {};

  if (status) {
    filter.status = status.toUpperCase();
  }
  if (memberId) {
    filter.memberId = memberId;
  }
  if (bookId) {
    filter.bookId = bookId;
  }

  const [borrowings, totalItems] = await Promise.all([
    BorrowingRecord.find(filter)
      .populate('memberId', 'name email membershipId')
      .populate('bookId', 'title author ISBN')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BorrowingRecord.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  const responseData = {
    borrowings,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, 'Borrowing records retrieved successfully'));
});

/**
 * @desc    Get a single borrowing record by ID
 * @route   GET /api/v1/borrowings/:id
 * @access  Public
 */
export const getBorrowingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const borrowing = await BorrowingRecord.findById(id)
    .populate('memberId', 'name email membershipId')
    .populate('bookId', 'title author ISBN');

  if (!borrowing) {
    throw new ApiError(404, `Borrowing record with ID '${id}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, borrowing, 'Borrowing record details retrieved successfully'));
});

/**
 * @desc    Delete/Cancel a borrowing record with inventory reconciliation
 * @route   DELETE /api/v1/borrowings/:id
 * @access  Public
 */
export const deleteBorrowing = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const borrowing = await BorrowingRecord.findById(id);
  if (!borrowing) {
    throw new ApiError(404, `Borrowing record with ID '${id}' not found`);
  }

  // Inventory reconciliation: if book was not returned yet, increment available copies
  if (borrowing.status !== 'RETURNED') {
    await Book.findByIdAndUpdate(borrowing.bookId, {
      $inc: { availableCopies: 1 },
    });
  }

  await borrowing.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Borrowing record deleted successfully'));
});
