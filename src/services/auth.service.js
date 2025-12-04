import { prisma } from "./prisma.js"; // if you created that file or import PrismaClient here
import bcrypt from "bcryptjs";

export async function createUser({ email, password, name }) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
        data: { email, password: hashed, name },
    });
    // remove password before returning
    const { password: _, ...rest } = user;
    return rest;
}

export async function findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

export async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}

export async function getAllUsers() {
    const users = await prisma.user.findMany();

    // remove passwords from each user before returning
    return users.map(({ password, ...rest }) => rest);
}

export async function getUserById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
}

export async function updateUser(id, data) {
    if (data.password) delete data.password;

    try {
        const exists = await prisma.user.findUnique({ where: { id } });
        console.log("User exists check:", exists);

        if (!exists) return null;

        const user = await prisma.user.update({
            where: { id },
            data,
        });

        const { password, ...rest } = user;
        return rest;

    } catch (err) {
        console.log("Update error:", err);
        return null;
    }
}

export async function deleteUser(id) {
    try {
        const user = await prisma.user.delete({ where: { id } });
        const { password, ...rest } = user;
        return rest;
    } catch (err) {
        return null;
    }
}