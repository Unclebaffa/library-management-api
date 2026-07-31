/**
 * Higher-order utility wrapper for async Express route handlers.
 * Eliminates redundant try-catch blocks by forwarding caught errors to Express next().
 * 
 * @param {Function} requestHandler - Async route handler function (req, res, next)
 * @returns {Function} Express middleware handler
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
