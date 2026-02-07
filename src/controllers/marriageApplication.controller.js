import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createMarriageApplication(req, res, next) {
    try {
        const {
            groomId,
            groomFather,
            groomMother,
            groomReligion,
            groomOccupation,
            groomEducation,
            groomAddress,
            brideId,
            brideFather,
            brideMother,
            brideReligion,
            brideOccupation,
            brideEducation,
            brideAddress,
            kaziId,
            proposedBy,
        } = req.body;

        // Validate required fields
        if (!groomId || !brideId || !kaziId || !proposedBy) {
            return res.status(400).json({ message: "Groom ID, Bride ID, Kazi ID, and Proposed By are required" });
        }

        if (!groomFather || !groomMother || !groomReligion || !groomOccupation || !groomEducation || !groomAddress) {
            return res.status(400).json({ message: "All groom fields are required" });
        }

        if (!brideFather || !brideMother || !brideReligion || !brideOccupation || !brideEducation || !brideAddress) {
            return res.status(400).json({ message: "All bride fields are required" });
        }

        // Check if groom and bride exist
        const groom = await prisma.user.findUnique({ where: { id: groomId } });
        const bride = await prisma.user.findUnique({ where: { id: brideId } });

        if (!groom || !bride) {
            return res.status(404).json({ message: "Groom or Bride not found" });
        }

        // Check if kazi application exists
        const kazi = await prisma.kaziApplication.findUnique({ where: { id: kaziId } });
        if (!kazi) {
            return res.status(404).json({ message: "Kazi not found" });
        }

        // Create marriage application
        const application = await prisma.marriageApplication.create({
            data: {
                groomId,
                groomFather,
                groomMother,
                groomReligion,
                groomOccupation,
                groomEducation,
                groomAddress,
                brideId,
                brideFather,
                brideMother,
                brideReligion,
                brideOccupation,
                brideEducation,
                brideAddress,
                kaziId,
                proposedBy,
                proposalDate: new Date(),
            },
        });

        res.status(201).json({ application });
    } catch (err) {
        console.log("Error in createMarriageApplication:", err);
        next(err);
    }
}

export async function getAllMarriageApplications(req, res, next) {
    try {
        const applications = await prisma.marriageApplication.findMany({
            include: {
                // You can add relations if needed
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({ applications });
    } catch (err) {
        console.log("Error in getAllMarriageApplications:", err);
        next(err);
    }
}

export async function getMarriageApplication(req, res, next) {
    try {
        const { id } = req.params;

        const application = await prisma.marriageApplication.findUnique({
            where: { id },
            include: {
                // You can add relations if needed
            },
        });

        if (!application) {
            return res.status(404).json({ message: "Marriage application not found" });
        }

        res.json({ application });
    } catch (err) {
        console.log("Error in getMarriageApplication:", err);
        next(err);
    }
}

export async function updateMarriageApplication(req, res, next) {
    try {
        const { id } = req.params;
        const {
            groomFather,
            groomMother,
            groomReligion,
            groomOccupation,
            groomEducation,
            groomAddress,
            brideFather,
            brideMother,
            brideReligion,
            brideOccupation,
            brideEducation,
            brideAddress,
            kaziId,
        } = req.body;

        const application = await prisma.marriageApplication.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({ message: "Marriage application not found" });
        }

        const updatedApplication = await prisma.marriageApplication.update({
            where: { id },
            data: {
                ...(groomFather && { groomFather }),
                ...(groomMother && { groomMother }),
                ...(groomReligion && { groomReligion }),
                ...(groomOccupation && { groomOccupation }),
                ...(groomEducation && { groomEducation }),
                ...(groomAddress && { groomAddress }),
                ...(brideFather && { brideFather }),
                ...(brideMother && { brideMother }),
                ...(brideReligion && { brideReligion }),
                ...(brideOccupation && { brideOccupation }),
                ...(brideEducation && { brideEducation }),
                ...(brideAddress && { brideAddress }),
                ...(kaziId && { kaziId }),
            },
        });

        res.json({ application: updatedApplication });
    } catch (err) {
        console.log("Error in updateMarriageApplication:", err);
        next(err);
    }
}

export async function updateMarriageApplicationStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { approvalStatus, maritalStatus } = req.body;

        const application = await prisma.marriageApplication.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({ message: "Marriage application not found" });
        }

        const updatedApplication = await prisma.marriageApplication.update({
            where: { id },
            data: {
                ...(approvalStatus && { approvalStatus }),
                ...(maritalStatus && { maritalStatus }),
                ...(approvalStatus === "approved" && { approvalDate: new Date() }),
                ...(maritalStatus === "married" && { marriageDate: new Date() }),
            },
        });

        res.json({ application: updatedApplication });
    } catch (err) {
        console.log("Error in updateMarriageApplicationStatus:", err);
        next(err);
    }
}

export async function deleteMarriageApplication(req, res, next) {
    try {
        const { id } = req.params;

        const application = await prisma.marriageApplication.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({ message: "Marriage application not found" });
        }

        await prisma.marriageApplication.delete({
            where: { id },
        });

        res.json({ message: "Marriage application deleted successfully" });
    } catch (err) {
        console.log("Error in deleteMarriageApplication:", err);
        next(err);
    }
}
