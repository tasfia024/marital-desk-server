import * as authService from "../services/auth.service.js";
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
        console.log("Updating user with ID:", id);

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
