// Wraps an async route handler so rejected promises reach errorHandler instead of hanging the request.
export function asyncHandler(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}
