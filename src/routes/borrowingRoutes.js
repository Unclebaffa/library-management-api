import { Router } from 'express';
import {
  borrowBook,
  returnBook,
  getAllBorrowings,
  getBorrowingById,
  deleteBorrowing,
} from '../controllers/borrowingController.js';
import { borrowBookValidator } from '../validators/borrowingValidator.js';
import validate from '../middlewares/validate.js';

const router = Router();

// Routes for /api/v1/borrowings
router
  .route('/')
  .post(borrowBookValidator, validate, borrowBook)
  .get(getAllBorrowings);

// Route to return a borrowed book
router.route('/:id/return').put(returnBook);

// Routes for /api/v1/borrowings/:id
router
  .route('/:id')
  .get(getBorrowingById)
  .delete(deleteBorrowing);

export default router;
