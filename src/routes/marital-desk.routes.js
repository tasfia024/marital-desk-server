import express, { json } from "express";
import { allUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/manageUser.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Debug logging middleware for all /users routes
router.use('/users', (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});


router.get("/users", requireAuth, allUsers);

router.get("/users/:id", requireAuth, getUser);
router.post("/users", requireAuth, createUser);
router.put("/users/:id", requireAuth, updateUser);
router.delete("/users/:id", requireAuth, deleteUser);

export default router;
