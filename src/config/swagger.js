export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Library Management System API',
    version: '1.0.0',
    description:
      'A RESTful API built with Node.js, Express, and MongoDB for managing books, library members, and book borrowing transactions.',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development Server',
    },
  ],
  tags: [
    { name: 'Health', description: 'System health check endpoints' },
    { name: 'Books', description: 'Book inventory management' },
    { name: 'Members', description: 'Library member management' },
    { name: 'Borrowings', description: 'Book borrowing and returning operations' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Root health check',
        description: 'Returns the operational health status of the Library Management System API.',
        responses: {
          200: {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Library Management System API is healthy' },
                    timestamp: { type: 'string', format: 'date-time', example: '2026-07-31T20:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/health': {
      get: {
        tags: ['Health'],
        summary: 'API v1 health check',
        description: 'Returns the operational health status of API v1.',
        responses: {
          200: {
            description: 'API v1 is operational',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Library Management System API v1 is operational' },
                    timestamp: { type: 'string', format: 'date-time', example: '2026-07-31T20:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/books': {
      get: {
        tags: ['Books'],
        summary: 'Get all books',
        description: 'Retrieve a paginated list of books with optional genre, author, or search keyword filtering.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: { type: 'integer', default: 1, minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            schema: { type: 'integer', default: 10, minimum: 1 },
          },
          {
            name: 'genre',
            in: 'query',
            description: 'Filter books by genre (case-insensitive search)',
            schema: { type: 'string' },
          },
          {
            name: 'author',
            in: 'query',
            description: 'Filter books by author (case-insensitive search)',
            schema: { type: 'string' },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search across title, author, and ISBN',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Books retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBookList',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Books'],
        summary: 'Create a new book',
        description: 'Add a new book entry to the library inventory.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BookCreateInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Book created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBook',
                },
              },
            },
          },
          400: {
            description: 'Bad Request (Validation error or Duplicate ISBN)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/books/{id}': {
      get: {
        tags: ['Books'],
        summary: 'Get book by ID',
        description: 'Fetch details of a specific book by its MongoDB ObjectId.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Book MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef1234' },
          },
        ],
        responses: {
          200: {
            description: 'Book details retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBook',
                },
              },
            },
          },
          404: {
            description: 'Book not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Books'],
        summary: 'Update book by ID',
        description: 'Modify information for an existing book.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Book MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef1234' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BookUpdateInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Book updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBook',
                },
              },
            },
          },
          400: {
            description: 'Bad Request (Validation error or Duplicate ISBN)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Book not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Books'],
        summary: 'Delete book by ID',
        description: 'Remove a book from the library database.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Book MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef1234' },
          },
        ],
        responses: {
          200: {
            description: 'Book deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseNull',
                },
              },
            },
          },
          404: {
            description: 'Book not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/members': {
      get: {
        tags: ['Members'],
        summary: 'Get all members',
        description: 'Retrieve a paginated list of library members with status and keyword filtering.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: { type: 'integer', default: 1, minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            schema: { type: 'integer', default: 10, minimum: 1 },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filter members by status',
            schema: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search across name, email, phone, and membershipId',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Members retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMemberList',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Members'],
        summary: 'Register a new member',
        description: 'Create a new member account in the library system.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MemberCreateInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Member registered successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMember',
                },
              },
            },
          },
          400: {
            description: 'Bad Request (Validation error or Duplicate email/membershipId)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/members/{id}': {
      get: {
        tags: ['Members'],
        summary: 'Get member by ID',
        description: 'Fetch details of a specific member by MongoDB ObjectId.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Member MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef5678' },
          },
        ],
        responses: {
          200: {
            description: 'Member details retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMember',
                },
              },
            },
          },
          404: {
            description: 'Member not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Members'],
        summary: 'Update member by ID',
        description: 'Update member information.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Member MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef5678' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MemberUpdateInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Member details updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseMember',
                },
              },
            },
          },
          400: {
            description: 'Bad Request (Validation error or Duplicate email/membershipId)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Member not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Members'],
        summary: 'Delete member by ID',
        description: 'Remove a member record from the database.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Member MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef5678' },
          },
        ],
        responses: {
          200: {
            description: 'Member deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseNull',
                },
              },
            },
          },
          404: {
            description: 'Member not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/borrowings': {
      get: {
        tags: ['Borrowings'],
        summary: 'Get all borrowing records',
        description: 'Retrieve a paginated list of borrowing records with optional status, memberId, or bookId filters.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: { type: 'integer', default: 1, minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            schema: { type: 'integer', default: 10, minimum: 1 },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filter borrowings by status',
            schema: { type: 'string', enum: ['BORROWED', 'RETURNED', 'OVERDUE'] },
          },
          {
            name: 'memberId',
            in: 'query',
            description: 'Filter borrowings by member ID',
            schema: { type: 'string' },
          },
          {
            name: 'bookId',
            in: 'query',
            description: 'Filter borrowings by book ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Borrowing records retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBorrowingList',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Borrowings'],
        summary: 'Borrow a book',
        description: 'Create a borrowing transaction for an active member and an available book.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BorrowBookInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Book borrowed successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBorrowing',
                },
              },
            },
          },
          400: {
            description: 'Bad Request (Member inactive, book out of stock, or already borrowed)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Member or Book not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/borrowings/{id}/return': {
      put: {
        tags: ['Borrowings'],
        summary: 'Return a borrowed book',
        description: 'Mark a borrowing record as returned and increment available book copies.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Borrowing Record MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef9999' },
          },
        ],
        responses: {
          200: {
            description: 'Book returned successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBorrowing',
                },
              },
            },
          },
          400: {
            description: 'Book has already been returned',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
          404: {
            description: 'Borrowing record not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/borrowings/{id}': {
      get: {
        tags: ['Borrowings'],
        summary: 'Get borrowing record by ID',
        description: 'Fetch details of a borrowing transaction by ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Borrowing Record MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef9999' },
          },
        ],
        responses: {
          200: {
            description: 'Borrowing record details retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseBorrowing',
                },
              },
            },
          },
          404: {
            description: 'Borrowing record not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Borrowings'],
        summary: 'Delete borrowing record',
        description: 'Delete or cancel a borrowing record with inventory reconciliation.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Borrowing Record MongoDB ObjectId',
            schema: { type: 'string', example: '66ab1234567890abcdef9999' },
          },
        ],
        responses: {
          200: {
            description: 'Borrowing record deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponseNull',
                },
              },
            },
          },
          404: {
            description: 'Borrowing record not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Book: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66ab1234567890abcdef1234' },
          title: { type: 'string', example: 'The Great Gatsby' },
          author: { type: 'string', example: 'F. Scott Fitzgerald' },
          ISBN: { type: 'string', example: '978-0743273565' },
          publicationYear: { type: 'integer', example: 1925 },
          genre: { type: 'string', example: 'Classic Fiction' },
          totalCopies: { type: 'integer', example: 5 },
          availableCopies: { type: 'integer', example: 4 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      BookCreateInput: {
        type: 'object',
        required: ['title', 'author', 'ISBN', 'publicationYear', 'genre', 'totalCopies'],
        properties: {
          title: { type: 'string', example: 'The Great Gatsby' },
          author: { type: 'string', example: 'F. Scott Fitzgerald' },
          ISBN: { type: 'string', example: '978-0743273565' },
          publicationYear: { type: 'integer', example: 1925 },
          genre: { type: 'string', example: 'Classic Fiction' },
          totalCopies: { type: 'integer', example: 5, minimum: 1 },
          availableCopies: { type: 'integer', example: 5, minimum: 0 },
        },
      },
      BookUpdateInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'The Great Gatsby (Revised Edition)' },
          author: { type: 'string', example: 'F. Scott Fitzgerald' },
          ISBN: { type: 'string', example: '978-0743273565' },
          publicationYear: { type: 'integer', example: 1925 },
          genre: { type: 'string', example: 'Fiction' },
          totalCopies: { type: 'integer', example: 10, minimum: 1 },
          availableCopies: { type: 'integer', example: 9, minimum: 0 },
        },
      },
      Member: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66ab1234567890abcdef5678' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '+1234567890' },
          membershipId: { type: 'string', example: 'MEM-123456-7890' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], example: 'ACTIVE' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MemberCreateInput: {
        type: 'object',
        required: ['name', 'email', 'phone'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '+1234567890' },
          membershipId: { type: 'string', example: 'MEM-123456-7890' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
        },
      },
      MemberUpdateInput: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Smith' },
          email: { type: 'string', format: 'email', example: 'john.smith@example.com' },
          phone: { type: 'string', example: '+1987654321' },
          membershipId: { type: 'string', example: 'MEM-123456-7890' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
        },
      },
      BorrowingRecord: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66ab1234567890abcdef9999' },
          memberId: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              membershipId: { type: 'string' },
            },
          },
          bookId: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              title: { type: 'string' },
              author: { type: 'string' },
              ISBN: { type: 'string' },
            },
          },
          borrowDate: { type: 'string', format: 'date-time' },
          dueDate: { type: 'string', format: 'date-time' },
          returnDate: { type: 'string', format: 'date-time', nullable: true },
          status: { type: 'string', enum: ['BORROWED', 'RETURNED', 'OVERDUE'], example: 'BORROWED' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      BorrowBookInput: {
        type: 'object',
        required: ['memberId', 'bookId'],
        properties: {
          memberId: { type: 'string', example: '66ab1234567890abcdef5678', description: 'Member Mongo ObjectId' },
          bookId: { type: 'string', example: '66ab1234567890abcdef1234', description: 'Book Mongo ObjectId' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          totalItems: { type: 'integer', example: 42 },
          totalPages: { type: 'integer', example: 5 },
          currentPage: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
        },
      },
      ApiResponseBook: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          data: { $ref: '#/components/schemas/Book' },
          message: { type: 'string', example: 'Book created successfully' },
          success: { type: 'boolean', example: true },
        },
      },
      ApiResponseBookList: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          data: {
            type: 'object',
            properties: {
              books: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
              pagination: { $ref: '#/components/schemas/Pagination' },
            },
          },
          message: { type: 'string', example: 'Books retrieved successfully' },
          success: { type: 'boolean', example: true },
        },
      },
      ApiResponseMember: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          data: { $ref: '#/components/schemas/Member' },
          message: { type: 'string', example: 'Member registered successfully' },
          success: { type: 'boolean', example: true },
        },
      },
      ApiResponseMemberList: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          data: {
            type: 'object',
            properties: {
              members: { type: 'array', items: { $ref: '#/components/schemas/Member' } },
              pagination: { $ref: '#/components/schemas/Pagination' },
            },
          },
          message: { type: 'string', example: 'Members retrieved successfully' },
          success: { type: 'boolean', example: true },
        },
      },
      ApiResponseBorrowing: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          data: { $ref: '#/components/schemas/BorrowingRecord' },
          message: { type: 'string', example: 'Book borrowed successfully' },
          success: { type: 'boolean', example: true },
        },
      },
      ApiResponseBorrowingList: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          data: {
            type: 'object',
            properties: {
              borrowings: { type: 'array', items: { $ref: '#/components/schemas/BorrowingRecord' } },
              pagination: { $ref: '#/components/schemas/Pagination' },
            },
          },
          message: { type: 'string', example: 'Borrowing records retrieved successfully' },
          success: { type: 'boolean', example: true },
        },
      },
      ApiResponseNull: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 200 },
          data: { type: 'object', nullable: true, example: null },
          message: { type: 'string', example: 'Operation completed successfully' },
          success: { type: 'boolean', example: true },
        },
      },
      ApiErrorResponse: {
        type: 'object',
        properties: {
          statusCode: { type: 'integer', example: 400 },
          message: { type: 'string', example: 'Validation failed or resource error' },
          errors: {
            type: 'array',
            items: { type: 'object' },
            example: [{ field: 'ISBN', message: 'Book with ISBN already exists' }],
          },
          success: { type: 'boolean', example: false },
        },
      },
    },
  },
};
