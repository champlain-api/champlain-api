/**
 * building.ts
 * This file defines the routes available for the building endpoint.
 * 
 * Possible endpoints:
 *  GET /building
 *      Returns a 404 if no building is found.
 * 
 *      The user can supply a `name` parameter which will return
 *      a building with the specified name, if it is found.
 * 
 */



import express, { type Response, type Request } from "express"

const router = express.Router()
import prisma from "../prisma_client.ts"
import { Prisma } from '@prisma/client'
import { requireAPIKeyScopes } from "../middleware/api-middleware.ts";

router.use(express.json())

router.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")

    let building;
    try {
        building = await prisma.building.findMany({
            orderBy: {
                id: "asc"
            }
        })
    } catch {
        res.status(500).json({ error: "Unable to get buildings." })
        return
    }
    res.json(building)
})
    .get("/:id", async (req: Request, res: Response) => {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid announcement id." })
            return
        }
        const building = await prisma.building.findFirst({
            where: {
                id: id
            }
        })
        if (building == null) {
            res.status(404).json({ error: "No building found with that id." })
            return
        }

        res.setHeader("Content-Type", "application/json")
        res.json(building)
    })
    .post("/", async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        const { name, location, hours } = req.body;
        let building;
        try {
            building = await prisma.building.create({
                data: {
                    name: name,
                    location: location,
                    hours: hours
                }
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({ error: e.meta })
                return
            } else if (e instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({ error: "Unable to create building. Please check that all fields are valid." + e })
                return
            } else {
                res.status(500).json({ error: "Unable to create building. " + e })
            }
        }
        res.status(200).json(building)
        return
    })
    .put("/:id", async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        const id = Number(req.params.id)
        const {name, location, hours} = req.body
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid announcement id." })
            return
        }
        let building;
        try {
            building = await prisma.building.update({
                where: {
                    id: id
                },
                data: {
                    name, location, hours
                }
            })
        } catch (e) {
            
        }
    })

export default router