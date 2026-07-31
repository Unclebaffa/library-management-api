import { Router } from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import {
  createBookValidator,
  updateBookValidator,
} from '../validators/bookValidator.js';
import validate from '../middlewares/validate.js';

const router = Router();

// Routes for /api/v1/books
router
  .route('/')
  .post(createBookValidator, validate, createBook)
  .get(getAllBooks);

// Routes for /api/v1/books/:id
router
  .route('/:id')
  .get(getBookById)
  .put(updateBookValidator, validate, updateBook)
  .delete(deleteBook);

export default router;
