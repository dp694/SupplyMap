export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Neo4j driver errors carry a `code` like "ServiceUnavailable" or "Neo.ClientError.Security.Unauthorized"
// when CognoDB is unreachable or misconfigured. Map those to a clean 503 instead of a raw stack trace.
function isDatabaseUnavailable(err) {
  return (
    err.name === "Neo4jError" &&
    (err.code === "ServiceUnavailable" || err.code === "SessionExpired")
  );
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (isDatabaseUnavailable(err)) {
    console.error("CognoDB unreachable:", err.message);
    return res.status(503).json({ error: "Database is unreachable. Please try again shortly." });
  }

  const statusCode = err.statusCode || 500;
  if (statusCode === 500) {
    console.error(err);
  }
  res.status(statusCode).json({ error: err.message || "Unexpected server error." });
}
