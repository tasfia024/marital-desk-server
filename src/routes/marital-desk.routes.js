import express, { json } from "express";
import { allUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/manageUser.controller.js";
import { allKaziApplications, createKaziApplication, getKaziApplication, updateKaziApplication, updateKaziStatus } from "../controllers/kaziApplication.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";
const router = express.Router();

// Debug logging middleware for all /users routes
router.use('/users', (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// User Management routes
router.get("/users", requireAuth, allUsers);
router.get("/users/:id", requireAuth, getUser);
router.post("/users", requireAuth, createUser);
// router.put("/users/:id", requireAuth, updateUser);
router.put(
    "/users/:id",
    requireAuth,
    uploadImage.single("image"), // image is OPTIONAL
    updateUser
);
router.delete("/users/:id", requireAuth, deleteUser);


// Kazi Application routes
router.get("/kazi-applications", requireAuth, allKaziApplications);
router.post("/kazi-applications", requireAuth, createKaziApplication);
router.get("/kazi-applications/:id", requireAuth, getKaziApplication);
router.put("/kazi-applications/:id", requireAuth, updateKaziApplication);
router.put("/kazi-applications/:id/update-status", requireAuth, updateKaziStatus);

export default router;