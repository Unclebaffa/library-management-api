import Book from '../models/Book.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Create a new book
 * @route   POST /api/v1/books
 * @access  Public
 */
export const createBook = asyncHandler(async (req, res) => {
  const { title, author, ISBN, publicationYear, genre, totalCopies, availableCopies } = req.body;

  // Check if book with given ISBN already exists
  const existingBook = await Book.findOne({ ISBN });
  if (existingBook) {
    throw new ApiError(400, `Book with ISBN '${ISBN}' already exists`);
  }

  const book = await Book.create({
    title,
    author,
    ISBN,
    publicationYear,
    genre,
    totalCopies,
    availableCopies: availableCopies !== undefined ? availableCopies : totalCopies,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, book, 'Book created successfully'));
});

/**
 * @desc    Get all books with filtering and pagination
 * @route   GET /api/v1/books
 * @access  Public
 */
export const getAllBooks = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const { genre, author, search } = req.query;
  const filter = {};

  if (genre) {
    filter.genre = { $regex: genre, $options: 'i' };
  }

  if (author) {
    filter.author = { $regex: author, $options: 'i' };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { ISBN: { $regex: search, $options: 'i' } },
    ];
  }

  const [books, totalItems] = await Promise.all([
    Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Book.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  const responseData = {
    books,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, 'Books retrieved successfully'));
});

/**
 * @desc    Get a single book by ID
 * @route   GET /api/v1/books/:id
 * @access  Public
 */
export const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, `Book with ID '${id}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, book, 'Book details retrieved successfully'));
});

/**
 * @desc    Update an existing book
 * @route   PUT /api/v1/books/:id
 * @access  Public
 */
export const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, author, ISBN, publicationYear, genre, totalCopies, availableCopies } = req.body;

  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, `Book with ID '${id}' not found`);
  }

  // Check ISBN conflict if ISBN is being changed
  if (ISBN && ISBN !== book.ISBN) {
    const existingISBN = await Book.findOne({ ISBN });
    if (existingISBN) {
      throw new ApiError(400, `Book with ISBN '${ISBN}' already exists`);
    }
  }

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (ISBN !== undefined) book.ISBN = ISBN;
  if (publicationYear !== undefined) book.publicationYear = publicationYear;
  if (genre !== undefined) book.genre = genre;
  if (totalCopies !== undefined) book.totalCopies = totalCopies;
  if (availableCopies !== undefined) book.availableCopies = availableCopies;

  const updatedBook = await book.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBook, 'Book updated successfully'));
});

/**
 * @desc    Delete a book by ID
 * @route   DELETE /api/v1/books/:id
 * @access  Public
 */
export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(404, `Book with ID '${id}' not found`);
  }

  await book.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Book deleted successfully'));
});
