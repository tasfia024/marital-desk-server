import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get applications for approval workflow (role-based filtering)
export async function getApprovalApplications(req, res, next) {
    try {
        const userId = req.user?.userId || req.user?.id;
        const userRole = req.user?.role;
        console.log("Fetching approval applications for user:", userId, "with role:", userRole);

        let whereClause = {};
        if (userRole !== 'super-admin') {
            whereClause = {
                OR: [
                    { groomId: userId },
                    { brideId: userId },
                    { kaziId: userId }
                ]
            };
        }

        const applications = await prisma.marriageApplication.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        const enhancedApplications = await Promise.all(
            applications.map(async (app) => {
                try {
                    const [groom, bride, kazi, proposedByUser] = await Promise.all([
                        prisma.user.findUnique({ where: { id: app.groomId }, select: { id: true, name: true } }),
                        prisma.user.findUnique({ where: { id: app.brideId }, select: { id: true, name: true } }),
                        prisma.kaziApplication.findFirst({ where: { kaziId: app.kaziId }, select: { id: true, kaziId: true, name: true } }),
                        prisma.user.findUnique({ where: { id: app.proposedBy }, select: { id: true, name: true } })
                    ]);

                    return {
                        ...app,
                        groom,
                        bride,
                        kazi,
                        proposedByUser,
                        groomName: groom?.name || 'N/A',
                        brideName: bride?.name || 'N/A',
                        kaziName: kazi?.name || 'N/A',
                        proposedByName: proposedByUser?.name || 'N/A'
                    };
                } catch (err) {
                    console.log("Error enhancing application data:", err);
                    return app;
                }
            })
        );

        res.json({ applications: enhancedApplications });
    } catch (err) {
        console.log("Error in getApprovalApplications:", err);
        next(err);
    }
}

// Kazi approves/checks the application
export async function updateKaziApproval(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if user has kazi role
        if (userRole !== "kazi") {
            return res.status(403).json({ message: "Only Kazi can approve this application" });
        }

        const application = await prisma.marriageApplication.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({ message: "Marriage application not found" });
        }

        // Check if proposal is accepted before approving
        if (application.proposalStatus !== "accepted") {
            return res.status(400).json({ message: "Both bride and groom must accept the proposal first" });
        }

        // Check if already checked by kazi
        if (application.approvalStatus === "checked") {
            return res.status(400).json({ message: "Application is already checked by Kazi" });
        }

        // Check if already approved by admin
        if (application.approvalStatus === "approved") {
            return res.status(400).json({ message: "Application is already approved by Admin" });
        }

        // Check if rejected
        if (application.approvalStatus === "rejected") {
            return res.status(400).json({ message: "Application has been rejected" });
        }

        const updatedApplication = await prisma.marriageApplication.update({
            where: { id },
            data: {
                approvalStatus: "checked",
                marriageDate: new Date(), // Store kazi approval date
            },
        });

        res.json({
            message: "Application checked successfully by Kazi",
            application: updatedApplication
        });
    } catch (err) {
        console.log("Error in updateKaziApproval:", err);
        next(err);
    }
}

// Kazi rejects the application
export async function updateKaziRejection(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if user has kazi role
        if (userRole !== "kazi") {
            return res.status(403).json({ message: "Only Kazi can reject this application" });
        }

        const application = await prisma.marriageApplication.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({ message: "Marriage application not found" });
        }

        // Check if already checked by kazi
        if (application.approvalStatus === "checked") {
            return res.status(400).json({ message: "Cannot reject - Application is already checked by Kazi" });
        }

        // Check if already rejected
        if (application.approvalStatus === "rejected") {
            return res.status(400).json({ message: "Application is already rejected" });
        }

        const updatedApplication = await prisma.marriageApplication.update({
            where: { id },
            data: {
                approvalStatus: "rejected",
                marriageDate: new Date(), // Store rejection date
            },
        });

        res.json({
            message: "Application rejected by Kazi",
            application: updatedApplication
        });
    } catch (err) {
        console.log("Error in updateKaziRejection:", err);
        next(err);
    }
}

// Admin gives final approval
export async function updateAdminApproval(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check if user is admin
        if (userRole !== "admin") {
            return res.status(403).json({ message: "Only Admin can give final approval" });
        }

        const application = await prisma.marriageApplication.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({ message: "Marriage application not found" });
        }

        // Check if kazi has already checked
        if (application.approvalStatus !== "checked") {
            return res.status(400).json({ message: "Kazi must check/approve first before Admin final approval" });
        }

        const updatedApplication = await prisma.marriageApplication.update({
            where: { id },
            data: {
                approvalStatus: "approved",
                approvalDate: new Date(), // Store admin approval date
            },
        });

        res.json({
            message: "Application approved successfully by Admin",
            application: updatedApplication
        });
    } catch (err) {
        console.log("Error in updateAdminApproval:", err);
        next(err);
    }
}

// Get applications filtered by role
export async function getMarriageApplicationsByRole(req, res, next) {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        const { status, approvalStatus } = req.query;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let whereClause = {};

        // Filter based on user role
        if (userRole === "kazi") {
            // Kazi sees applications with accepted proposal status
            whereClause = {
                proposalStatus: "accepted",
            };
        } else if (userRole === "user") {
            // Regular users see applications where they are groom or bride
            whereClause = {
                OR: [
                    { groomId: userId },
                    { brideId: userId }
                ]
            };
        } else if (userRole === "admin") {
            // Admin sees all applications that are kazi-checked and waiting for final approval
            whereClause = {
                proposalStatus: "accepted",
                approvalStatus: "checked"
            };
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Apply additional filters
        if (status) {
            whereClause.proposalStatus = status;
        }
        if (approvalStatus) {
            whereClause.approvalStatus = approvalStatus;
        }

        const applications = await prisma.marriageApplication.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        // Enhance data with user and kazi names
        const enhancedApplications = await Promise.all(
            applications.map(async (app) => {
                try {
                    const [groom, bride, kazi, proposedByUser] = await Promise.all([
                        prisma.user.findUnique({ where: { id: app.groomId }, select: { id: true, name: true, email: true, mobile: true } }),
                        prisma.user.findUnique({ where: { id: app.brideId }, select: { id: true, name: true, email: true, mobile: true } }),
                        prisma.kaziApplication.findFirst({ where: { kaziId: app.kaziId }, select: { id: true, kaziId: true, name: true, email: true } }),
                        prisma.user.findUnique({ where: { id: app.proposedBy }, select: { id: true, name: true } })
                    ]);

                    return {
                        ...app,
                        groom,
                        bride,
                        kazi,
                        proposedByUser
                    };
                } catch (err) {
                    console.log("Error enhancing application data:", err);
                    return app;
                }
            })
        );

        res.json({ applications: enhancedApplications });
    } catch (err) {
        console.log("Error in getMarriageApplicationsByRole:", err);
        next(err);
    }
}
