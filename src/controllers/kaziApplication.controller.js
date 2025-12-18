import { prisma } from "../services/prisma.js";

export async function allKaziApplications(req, res, next) {
    try {
        let applications;
        console.log('req.user?.role', req.user?.id);
        if (req.user?.role === "super-admin") {
            applications = await prisma.kaziApplication.findMany();
        } else {
            applications = await prisma.kaziApplication.findMany({
                where: { email: req.user?.email }
            });
        }
        res.json({ applications });
    } catch (err) {
        next(err);
    }
}

export async function createKaziApplication(req, res, next) {
    try {
        const data = req.body;
        // Only allow non-super-admin to apply once
        if (req.user?.role !== "super-admin") {
            const exists = await prisma.kaziApplication.findFirst({
                where: { email: req.user?.email }
                // where: { userId: req.user?.id }
            });
            if (exists) {
                return res.status(403).json({ message: "You have already applied for Kazi. Only one application allowed per user." });
            }
            // data.userId = req.user?.id;
        }
        const application = await prisma.kaziApplication.create({ data });
        res.status(201).json({ application });
    } catch (err) {
        next(err);
    }
}

export async function getKaziApplication(req, res, next) {
    try {
        const { id } = req.params;
        const application = await prisma.kaziApplication.findUnique({ where: { id } });
        if (!application) return res.status(404).json({ message: "Application not found" });
        res.json({ application });
    } catch (err) {
        next(err);
    }
}

export async function updateKaziApplication(req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;
        // Validate uniqueness for registrationNo, email, phone, nid
        const uniqueFields = ["registrationNo", "email", "phone", "nid"];
        for (const field of uniqueFields) {
            if (data[field]) {
                const exists = await prisma.kaziApplication.findFirst({
                    where: {
                        [field]: data[field],
                        NOT: { id }
                    }
                });
                if (exists) {
                    return res.status(409).json({ field, message: `${field} already exists` });
                }
            }
        }
        const updated = await prisma.kaziApplication.update({ where: { id }, data });
        res.json({ application: updated });
    } catch (err) {
        next(err);
    }
}

export async function updateKaziStatus(req, res, next) {
    try {
        const { id } = req.params;
        // const { status } = req.body;
        const result = await prisma.$transaction(async (tx) => {
            const application = await tx.kaziApplication.update({
                where: { id },
                data: { status: 'approved' }
            });

            // 2️⃣ Update User role using email from application
            const user = await tx.user.update({
                where: { email: application.email },
                data: { role: 'kazi' }
            });

            return { application, user };
        });

        res.json({
            message: 'Kazi approved and user role updated',
            data: result
        });

    } catch (err) {
        next(err);
    }
}
