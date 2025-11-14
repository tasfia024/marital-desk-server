import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // contains userId, email, role
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
