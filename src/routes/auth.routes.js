import express, { json } from "express";
import { register, login, userProfile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();


router.post("/register", register);
router.post("/login", login);

// private api 
router.get("/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
});

router.get("/user-profile", requireAuth, userProfile);

export default router;
