# Library Management System REST API

A scalable, production-ready RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** following the Model-View-Controller (MVC) architectural pattern. The system manages library inventory (Books), registered library patrons (Members), and automated book issuing & returning (Borrowing Records) with transactional inventory controls.

---

## Table of Contents
- [Tech Stack & System Requirements](#tech-stack--system-requirements)
- [Architecture Overview](#architecture-overview)
- [Setup & Installation Instructions](#setup--installation-instructions)
- [API Endpoint Matrix](#api-endpoint-matrix)
  - [Books API](#books-api)
  - [Members API](#members-api)
  - [Borrowing Records API](#borrowing-records-api)
- [Centralized Error Handling](#centralized-error-handling)
- [Git Commit Roadmap](#git-commit-roadmap)

---

## Tech Stack & System Requirements

### Core Frameworks & Runtime
- **Node.js**: `v18.0.0` or higher
- **Express.js**: `^4.19.2`
- **MongoDB**: `v6.0` or higher (via Mongoose `^8.4.1`)
- **Module System**: ES6 Modules (`"type": "module"`)

### Production Middlewares & Utilities
- **helmet** (`^7.1.0`): Security HTTP header protection
- **cors** (`^2.8.5`): Cross-Origin Resource Sharing configuration
- **morgan** (`^1.10.0`): HTTP request logging
- **dotenv** (`^16.4.5`): Environment variable management
- **express-validator** (`^7.1.0`): Declarative request validation & sanitization

---

## Architecture Overview

The project strictly enforces the **MVC Architecture** pattern with clear separation of concerns across routes, controllers, database models, validators, and middlewares.

```text
library-management-api/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── config/
    │   └── db.js                 # MongoDB connection configuration
    ├── controllers/
    │   ├── bookController.js      # Book entity business logic
    │   ├── memberController.js    # Member entity business logic
    │   └── borrowingController.js # Borrowing domain engine logic
    ├── middlewares/
    │   ├── errorHandler.js        # Centralized global error handler
    │   └── validate.js            # Express-validator error interceptor
    ├── models/
    │   ├── Book.js                # Book Mongoose schema
    │   ├── Member.js              # Member Mongoose schema
    │   └── BorrowingRecord.js     # BorrowingRecord Mongoose schema
    ├── routes/
    │   ├── bookRoutes.js          # Book routes (/api/v1/books)
    │   ├── memberRoutes.js        # Member routes (/api/v1/members)
    │   └── borrowingRoutes.js     # Borrowing routes (/api/v1/borrowings)
    ├── utils/
    │   ├── ApiError.js            # Custom operational error class
    │   ├── ApiResponse.js         # Standard success response formatter
    │   └── asyncHandler.js        # Higher-order async exception wrapper
    ├── app.js                     # Express middleware & router assembly
    └── server.js                  # HTTP server entry point
```

---

## Setup & Installation Instructions

### Prerequisites
1. Installed **Node.js** (v18+) and **npm**.
2. Installed and running instance of **MongoDB** locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI.

### 1. Clone & Navigate to Repository
```bash
git clone <repository-url>
cd library-management-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your local `.env` configuration file:
```bash
cp .env.example .env
```

Edit `.env` as required:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/library_db
CORS_ORIGIN=*
```

### 4. Run Server
#### Development Mode (with Node watch mode):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

### 5. Verify Installation
Navigate to `http://localhost:5000/api/v1/health` in your browser or HTTP client. You should receive:
```json
{
  "success": true,
  "message": "Library Management System API v1 is operational",
  "timestamp": "2026-07-31T19:00:00.000Z"
}
```

---

## API Endpoint Matrix

All API endpoints are prefixed with `/api/v1`.

### Books API

| HTTP Method | Endpoint URI | Description | Access Level |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/books` | Create a new book record | Public |
| **GET** | `/api/v1/books` | Get all books (paginated & filterable) | Public |
| **GET** | `/api/v1/books/:id` | Get book details by ID | Public |
| **PUT** | `/api/v1/books/:id` | Update an existing book record | Public |
| **DELETE**| `/api/v1/books/:id` | Delete a book record | Public |

#### 1. Create Book (`POST /api/v1/books`)
- **Request Body**:
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "ISBN": "978-0132350884",
  "publicationYear": 2008,
  "genre": "Software Engineering",
  "totalCopies": 5
}
```
- **Success Response (201 Created)**:
```json
{
  "statusCode": 201,
  "data": {
    "_id": "66ab0123c4567890abcdef01",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "ISBN": "978-0132350884",
    "publicationYear": 2008,
    "genre": "Software Engineering",
    "totalCopies": 5,
    "availableCopies": 5,
    "createdAt": "2026-07-31T19:00:00.000Z",
    "updatedAt": "2026-07-31T19:00:00.000Z"
  },
  "message": "Book created successfully",
  "success": true
}
```
- **Error Response (400 Bad Request - Duplicate ISBN)**:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Book with ISBN '978-0132350884' already exists",
  "errors": []
}
```

#### 2. Get All Books (`GET /api/v1/books?page=1&limit=10&genre=Software&search=Clean`)
- **Success Response (200 OK)**:
```json
{
  "statusCode": 200,
  "data": {
    "books": [
      {
        "_id": "66ab0123c4567890abcdef01",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "ISBN": "978-0132350884",
        "publicationYear": 2008,
        "genre": "Software Engineering",
        "totalCopies": 5,
        "availableCopies": 5
      }
    ],
    "pagination": {
      "totalItems": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10
    }
  },
  "message": "Books retrieved successfully",
  "success": true
}
```

---

### Members API

| HTTP Method | Endpoint URI | Description | Access Level |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/members` | Register a new member | Public |
| **GET** | `/api/v1/members` | Get all members (paginated & filterable) | Public |
| **GET** | `/api/v1/members/:id` | Get member details by ID | Public |
| **PUT** | `/api/v1/members/:id` | Update member details | Public |
| **DELETE**| `/api/v1/members/:id` | Delete member record | Public |

#### 1. Register Member (`POST /api/v1/members`)
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1-555-0199",
  "status": "ACTIVE"
}
```
- **Success Response (201 Created)**:
```json
{
  "statusCode": 201,
  "data": {
    "_id": "66ab0456c7890123abcdef02",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1-555-0199",
    "membershipId": "MEM-500001-4321",
    "status": "ACTIVE",
    "createdAt": "2026-07-31T19:00:00.000Z",
    "updatedAt": "2026-07-31T19:00:00.000Z"
  },
  "message": "Member registered successfully",
  "success": true
}
```

---

### Borrowing Records API

| HTTP Method | Endpoint URI | Description | Access Level |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/borrowings` | Borrow a book (Decrements inventory) | Public |
| **PUT** | `/api/v1/borrowings/:id/return` | Return a borrowed book (Increments inventory) | Public |
| **GET** | `/api/v1/borrowings` | List all borrowings (Populated references) | Public |
| **GET** | `/api/v1/borrowings/:id` | Get borrowing record by ID | Public |
| **DELETE**| `/api/v1/borrowings/:id` | Delete borrowing record (Inventory safety) | Public |

#### 1. Borrow a Book (`POST /api/v1/borrowings`)
- **Request Body**:
```json
{
  "memberId": "66ab0456c7890123abcdef02",
  "bookId": "66ab0123c4567890abcdef01"
}
```
- **Success Response (201 Created)**:
```json
{
  "statusCode": 201,
  "data": {
    "_id": "66ab0789c0123456abcdef03",
    "memberId": {
      "_id": "66ab0456c7890123abcdef02",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "membershipId": "MEM-500001-4321"
    },
    "bookId": {
      "_id": "66ab0123c4567890abcdef01",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "ISBN": "978-0132350884"
    },
    "borrowDate": "2026-07-31T19:00:00.000Z",
    "dueDate": "2026-08-14T19:00:00.000Z",
    "returnDate": null,
    "status": "BORROWED"
  },
  "message": "Book borrowed successfully",
  "success": true
}
```
- **Error Response (400 Bad Request - Book Unavailable)**:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Book currently unavailable",
  "errors": []
}
```

#### 2. Return a Book (`PUT /api/v1/borrowings/66ab0789c0123456abcdef03/return`)
- **Success Response (200 OK)**:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "66ab0789c0123456abcdef03",
    "returnDate": "2026-07-31T19:30:00.000Z",
    "status": "RETURNED"
  },
  "message": "Book returned successfully",
  "success": true
}
```

---

## Centralized Error Handling

The application handles errors through `src/middlewares/errorHandler.js`, transforming raw exceptions into clean JSON responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Resource not found with invalid _id: invalid_id_string",
  "errors": [],
  "stack": "..."
}
```

### Handled Error Scenarios:
1. **Custom `ApiError`**: Returns explicit status code and message.
2. **Mongoose `CastError`**: Converts invalid MongoDB ObjectIDs into `400 Bad Request`.
3. **Mongoose Duplicate Key (`E11000`)**: Formats unique field collisions (email, ISBN, membershipId) into user-friendly `400 Bad Request`.
4. **Mongoose `ValidationError`**: Formats schema validation failures with detailed field messages.
5. **Wildcard `404` Handler**: Catches invalid endpoint requests (`app.use('*')`).

---

## Git Commit Roadmap

Below is the conventional commit history reflecting the development workflow for this system:

1. `chore: initialize Node.js project manifest and configure dependencies`
2. `feat(config): implement asynchronous MongoDB connection handler in db.js`
3. `feat(utils): create custom ApiError class and asyncHandler higher-order wrapper`
4. `feat(app): configure Express application middleware and server startup boilerplate`
5. `feat(models): define Book schema with automatic copy availability hook`
6. `feat(models): define Member schema with membershipId auto-generation`
7. `feat(validators): create express-validator chains for Book and Member endpoints`
8. `feat(controllers): implement CRUD business logic for Books entity`
9. `feat(controllers): implement CRUD business logic for Members entity`
10. `feat(routes): register Express routers for Books and Members endpoints`
11. `feat(models): define BorrowingRecord schema with due date calculations`
12. `feat(controllers): implement borrowing logic, return processing, and copy inventory tracking`
13. `feat(routes): configure borrowing endpoints and mount router in Express app`
14. `feat(middleware): harden centralized error handler with Mongoose CastError, E11000, and 404 fallback`
15. `docs: complete README API documentation, setup guide, and endpoint matrix`

---
*Developed as part of the Library Management System REST API Project.*
