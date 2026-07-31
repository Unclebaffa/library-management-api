import { Router } from 'express';
import {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from '../controllers/memberController.js';
import {
  createMemberValidator,
  updateMemberValidator,
} from '../validators/memberValidator.js';
import validate from '../middlewares/validate.js';

const router = Router();

// Routes for /api/v1/members
router
  .route('/')
  .post(createMemberValidator, validate, createMember)
  .get(getAllMembers);

// Routes for /api/v1/members/:id
router
  .route('/:id')
  .get(getMemberById)
  .put(updateMemberValidator, validate, updateMember)
  .delete(deleteMember);

export default router;
