export function errorHandler(err, req, res, next) {
    console.error(err); // replace with structured logger in prod
    res.status(500).json({ message: err.message || "Internal server error" });
}
