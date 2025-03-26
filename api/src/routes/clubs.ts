import express from "express";
import type { Response, Request } from "express";
import prisma from "../prisma_client.ts";

const router = express.Router();

// Route to get all clubs
router.get("/", async (req: Request, res: Response) => {
    try {
        const clubs = await prisma.club.findMany();
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving clubs", details: error });
    }
});

// Route to get a specific club by name
router.get("/:clubName", async (req: Request, res: Response) => {
    try {
        const clubs = await prisma.club.findMany({
            include: {
                clubInfo: {
                    include: {
                        officers: true
                    }
                }
            }
        });
        
        const club = await prisma.club.findUnique({
            where: { name: req.params.clubName },
            include: {
                clubInfo: {
                    include: {
                        officers: true
                    }
                }
            }
        });
``
        if (!club) {
            res.status(404).json({ error: "Club not found" });
        }

        res.json(club);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving club", details: error });
    }
});

// Route to create a new club
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, 
            clubInfo, //  type, semester (array), officers (array of name/title)
            primaryContact,
            email,
            description,
           } = req.body;

        const newClub = await prisma.club.create({
            data: {
                name,
                description,
                primaryContact,
                email,
                clubInfo: {
                    create: {
                        type: clubInfo.type,
                        semester: { set: clubInfo.semester }, // string[]
                        officers: {
                            createMany: {
                                data: clubInfo.officers
                            }
                        }
                    }
                }
            },
            include: {
                clubInfo: {
                    include: {
                        officers: true
                    }
                }
            }
        });

        res.json(newClub);
    } catch (error) {
        res.status(500).json({ error: "Error creating club", details: error });
    }
});

export default router;
