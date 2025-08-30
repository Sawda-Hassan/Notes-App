export function notFound(_req, res, _next) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, _req, res, _next) {
  console.error(err); // keep simple for now
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err?.message || "Server error",
  });
}
