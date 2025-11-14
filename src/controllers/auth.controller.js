import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/index.js";
import * as authService from "../services/auth.service.js";

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function register(req, res, next) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const existing = await authService.findUserByEmail(email);
        if (existing) return res.status(409).json({ message: "Email already registered" });

        const user = await authService.createUser({ email, password, name });
        const token = signToken({ userId: user.id, email: user.email, role: user.role });
        res.status(201).json({ user, token });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await authService.findUserByEmail(email);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const ok = await authService.verifyPassword(password, user.password);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });

        // remove password field
        const { password: _, ...safeUser } = user;
        const token = signToken({ userId: user.id, email: user.email, role: user.role });
        res.json({ user: safeUser, token });
    } catch (err) {
        next(err);
    }
}
