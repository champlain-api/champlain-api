import express from "express";
import type { Response, Request } from "express";
import prisma from "../prisma_client.ts";
import {Prisma, APIKeyScopes} from "@prisma/client";
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";

const router = express.Router();
router.use(express.json())


// GET all clubs (including officers)
router.get("/", async (req: Request, res: Response) => {
    try {
        const clubs = await prisma.club.findMany({
            include: { officers: true }
        });
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving clubs: " + error });
    }
});

// Route to get a specific club by name
router.get("/:clubName", async (req: Request, res: Response) => {
    try {
        const club = await prisma.club.findUnique({
            where: { name: req.params.clubName },
            include: { officers: true }
        });

        if (!club) {
            res.status(404).json({ error: "Club not found" });
        }

        res.json(club);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving club: " + error });
    }
});

// to update a club 
router.put("/:clubId", requireAPIKeyScopes([APIKeyScopes.CLUB_EDIT]), async (req: Request, res: Response) => {
    const { clubId } = req.params;
    const data = req.body;

    try {
        const updatedClub = await prisma.club.update({
            where: { id: parseInt(clubId) },
            data,
            include: { officers: true }
        });

        res.json(updatedClub);
    } catch (error) {
        res.status(500).json({ error: "Error updating club: " + error });
    }
});

// Route to create a new club
router.post("/", requireAPIKeyScopes([APIKeyScopes.CLUB_EDIT]), async (req: Request, res: Response) => {
    try {
        const {
            name,
            type,
            semester,
            primaryContact,
            email,
            description,
            officers // expects array of { name, title }
        } = req.body;

        const newClub = await prisma.club.create({
            data: {
                name,
                type,
                semester,
                primaryContact,
                email,
                description,
                officers: {
                    create: officers
                }
            },
            include: { officers: true }
        });

        res.status(201).json(newClub);
    } catch (error) {
        res.status(500).json({ error: "Error creating club", details: error });
    }
});

// to delete a club by id
router.delete("/:clubId", requireAPIKeyScopes([APIKeyScopes.CLUB_EDIT]), async (req: Request, res: Response) => {
    const { clubId } = req.params;

    try {
        // Delete officers first to avoid FK constraint
        await prisma.officer.deleteMany({
            where: { id: parseInt(clubId) }
        });

        await prisma.club.delete({
            where: { id: parseInt(clubId) }
        });

        res.json({ message: "Club deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting club: " + error });
    }
});

// GET all officers
router.get("/officers", async (req: Request, res: Response) => {
    try {
      const officers = await prisma.officer.findMany();
      res.json(officers);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving officers: " + error });
    }
  });

  //  route to update an officer 
  router.put("/officers/:officerId", requireAPIKeyScopes([APIKeyScopes.CLUB_EDIT]), async (req: Request, res: Response) => {
    const { officerId } = req.params;
    const { name, title } = req.body;
  
    try {
      const updatedOfficer = await prisma.officer.update({
        where: { id: parseInt(officerId) },
        data: { name, title }
      });
  
      res.json(updatedOfficer);
    } catch (error) {
      res.status(500).json({ error: "Error updating officer: " + error });
    }
  });

  // route delete an officer 
  router.delete("/officers/:officerId", requireAPIKeyScopes([APIKeyScopes.CLUB_EDIT]), async (req: Request, res: Response) => {
    const { officerId } = req.params;
  
    try {
      await prisma.officer.delete({
        where: { id: parseInt(officerId) }
      });
  
      res.json({ message: "Officer deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting officer: " + error });
    }
  });

export default router;