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
