import * as authService from "../services/auth.service.js";
import { prisma } from "../services/prisma.js";
import { handleSingleImageUpload } from "../services/imageUpload.service.js";

export async function allUsers(req, res, next) {
    try {
        const users = await authService.getAllUsers();

        res.json({ users }); // return the actual list
    } catch (err) {
        next(err);
    }
}

export async function getUser(req, res, next) {
    try {
        const user = await authService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user });
    } catch (err) {
        next(err);
    }
}

export async function createUser(req, res, next) {
    try {
        const { email, password, name } = req.body;
        const user = await authService.createUser({ email, password, name });
        res.status(201).json({ user });
    } catch (err) {
        next(err);
    }
}

export async function updateUser(req, res, next) {
    try {
        const id = req.params.id;
        const existUser = await authService.getUserById(req.params.id);
        req.body.oldImage = existUser ? existUser.image : null;

        const imagePath = handleSingleImageUpload(
            req.file,
            req.body.oldImage // optional
        );
        if (imagePath) {
            req.body.image = imagePath;
        }

        const data = req.body;
        delete data.oldImage; // cleanup

        let dob = req.body.dob;
        if (dob) {
            const date = new Date(dob);
            data.dob = date;
        }

        const user = await authService.updateUser(id, data);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ user });
    } catch (err) {
        console.log("Error in updateUser controller:", err);
        // Return 400 for validation errors (NID/Mobile uniqueness)
        if (err.message.includes("already exists")) {
            return res.status(400).json({ error: err.message });
        }
        next(err);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const id = req.params.id;
        const user = await authService.deleteUser(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted" });
    } catch (err) {
        next(err);
    }
}

export async function getUserMaritalStatus(req, res, next) {
    try {
        const userId = req.params.id;

        // Find all marriage applications where this user is groom or bride
        const marriages = await prisma.marriageApplication.findMany({
            where: {
                OR: [
                    { groomId: userId },
                    { brideId: userId }
                ]
            },
            orderBy: { createdAt: "desc" }
        });

        if (marriages.length === 0) {
            return res.json({
                maritalStatus: "Single",
                marriageCount: 0,
                divorceCount: 0,
                details: []
            });
        }

        // Count marriages and divorces
        const marriageCount = marriages.filter(m => m.maritalStatus === "married").length;
        const divorceCount = marriages.filter(m => m.maritalStatus === "divorced").length;

        // Determine current status: if any active marriage exists, status is "Married"
        // Otherwise, if divorced records exist, status is "Divorced"
        // Otherwise status is "Single"
        let maritalStatus = "Single";
        if (marriageCount > 0) {
            maritalStatus = "Married";
        } else if (divorceCount > 0) {
            maritalStatus = "Divorced";
        }

        res.json({
            maritalStatus,
            marriageCount,
            divorceCount,
            details: marriages
        });
    } catch (err) {
        console.log("Error in getUserMaritalStatus:", err);
        next(err);
    }
}
