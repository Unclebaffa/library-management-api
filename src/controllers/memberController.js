import Member from '../models/Member.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Register a new member
 * @route   POST /api/v1/members
 * @access  Public
 */
export const createMember = asyncHandler(async (req, res) => {
  const { name, email, phone, membershipId, status } = req.body;

  // Check if member with given email already exists
  const existingEmail = await Member.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new ApiError(400, `Member with email '${email}' already exists`);
  }

  // Check if membershipId is provided and conflicts
  if (membershipId) {
    const existingId = await Member.findOne({ membershipId });
    if (existingId) {
      throw new ApiError(400, `Member with membership ID '${membershipId}' already exists`);
    }
  }

  const member = await Member.create({
    name,
    email,
    phone,
    membershipId,
    status,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, member, 'Member registered successfully'));
});

/**
 * @desc    Get all members with filtering and pagination
 * @route   GET /api/v1/members
 * @access  Public
 */
export const getAllMembers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const skip = (page - 1) * limit;

  const { status, search } = req.query;
  const filter = {};

  if (status) {
    filter.status = status.toUpperCase();
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { membershipId: { $regex: search, $options: 'i' } },
    ];
  }

  const [members, totalItems] = await Promise.all([
    Member.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Member.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  const responseData = {
    members,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, 'Members retrieved successfully'));
});

/**
 * @desc    Get a single member by ID
 * @route   GET /api/v1/members/:id
 * @access  Public
 */
export const getMemberById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await Member.findById(id);
  if (!member) {
    throw new ApiError(404, `Member with ID '${id}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, member, 'Member details retrieved successfully'));
});

/**
 * @desc    Update an existing member
 * @route   PUT /api/v1/members/:id
 * @access  Public
 */
export const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, membershipId, status } = req.body;

  const member = await Member.findById(id);
  if (!member) {
    throw new ApiError(404, `Member with ID '${id}' not found`);
  }

  // Check email conflict if email is updated
  if (email && email.toLowerCase() !== member.email) {
    const existingEmail = await Member.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      throw new ApiError(400, `Member with email '${email}' already exists`);
    }
  }

  // Check membershipId conflict if updated
  if (membershipId && membershipId !== member.membershipId) {
    const existingId = await Member.findOne({ membershipId });
    if (existingId) {
      throw new ApiError(400, `Member with membership ID '${membershipId}' already exists`);
    }
  }

  if (name !== undefined) member.name = name;
  if (email !== undefined) member.email = email;
  if (phone !== undefined) member.phone = phone;
  if (membershipId !== undefined) member.membershipId = membershipId;
  if (status !== undefined) member.status = status;

  const updatedMember = await member.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedMember, 'Member details updated successfully'));
});

/**
 * @desc    Delete a member by ID
 * @route   DELETE /api/v1/members/:id
 * @access  Public
 */
export const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await Member.findById(id);
  if (!member) {
    throw new ApiError(404, `Member with ID '${id}' not found`);
  }

  await member.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Member deleted successfully'));
});
