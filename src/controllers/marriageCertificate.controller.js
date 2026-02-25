import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get applications for approval workflow (role-based filtering)
export async function getMarriageCertificate(req, res, next) {
    try {
        const userId = req.user?.userId || req.user?.id;
        const userRole = req.user?.role;

        let whereClause = { approvalStatus: "approved" };
        if (userRole !== 'super-admin') {
            whereClause = {
                AND: [
                    {
                        OR: [
                            { groomId: userId },
                            { brideId: userId },
                            { kaziId: userId }
                        ]
                    },
                    { approvalStatus: "approved" }
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
                        prisma.user.findUnique({ where: { id: app.groomId }, select: { id: true, name: true, nid: true } }),
                        prisma.user.findUnique({ where: { id: app.brideId }, select: { id: true, name: true, nid: true } }),
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
