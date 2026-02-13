/**
 * Async handler to wrap async route handlers and pass errors to next().
 * Eliminates the need for try-catch blocks in every async controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
