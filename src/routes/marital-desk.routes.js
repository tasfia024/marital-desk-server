import express, { json } from "express";
import { allUsers, getUser, createUser, updateUser, deleteUser, getUserMaritalStatus } from "../controllers/manageUser.controller.js";
import {
    allKaziApplications,
    getApprovedKazis,
    createKaziApplication,
    getKaziApplication,
    updateKaziApplication,
    updateKaziStatus
} from "../controllers/kaziApplication.controller.js";

import {
    createMarriageApplication,
    getAllMarriageApplications,
    getMarriageApplication,
    updateMarriageApplication,
    updateMarriageApplicationStatus,
    deleteMarriageApplication
} from "../controllers/marriageApplication.controller.js";
import {
    updateKaziApproval,
    updateKaziRejection,
    updateAdminApproval,
    getApprovalApplications
} from "../controllers/marriageApplicationApproval.controller.js";
import { getMarriageCertificate } from "../controllers/marriageCertificate.controller.js";
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
router.get("/users/:id/marital-status", requireAuth, getUserMaritalStatus);
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
router.get("/approved-kazis", requireAuth, getApprovedKazis);
router.post("/kazi-applications", requireAuth, createKaziApplication);
router.get("/kazi-applications/:id", requireAuth, getKaziApplication);
router.put("/kazi-applications/:id", requireAuth, updateKaziApplication);
router.put("/kazi-applications/:id/update-status", requireAuth, updateKaziStatus);

// Marriage Application routes
router.post("/marriage-applications", requireAuth, createMarriageApplication);
router.get("/marriage-applications", requireAuth, getAllMarriageApplications);
router.get("/marriage-applications/:id", requireAuth, getMarriageApplication);
router.put("/marriage-applications/:id", requireAuth, updateMarriageApplication);
router.put("/marriage-applications/:id/update-status", requireAuth, updateMarriageApplicationStatus);
router.delete("/marriage-applications/:id", requireAuth, deleteMarriageApplication);

// Marriage Approval Application routes
router.get("/marriage-approval-applications", requireAuth, getApprovalApplications);
router.put("/marriage-approval-applications/:id/kazi-approval", requireAuth, updateKaziApproval);
router.put("/marriage-approval-applications/:id/kazi-rejection", requireAuth, updateKaziRejection);
router.put("/marriage-approval-applications/:id/admin-approval", requireAuth, updateAdminApproval);

// Marriage Certificate routes
router.get("/marriage-certificates", requireAuth, getMarriageCertificate);

export default router;