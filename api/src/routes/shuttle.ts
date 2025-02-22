/*
 * shuttle.ts
 * This defines the routes for the shuttle endpoint.
 * 
 * Users can do the following:
 * 
 * Request all shuttles
 *  GET /shuttles
 *      Parameters:
 *          updatedWithin: Int - only show shuttles updated
 *                               within the past X hours. Defaults to 2.
 *  Returns a 400 if the updatedWithin are invalid.
 * 
 * Request a specific shuttle given an ID
 *  GET /shuttles/:id
 *      Returns a 404 if the ID is invalid.
 *
 * Create/update a shuttle with
 * the information JSON-encoded in
 * the request body
 *  PUT /shuttle/:id
 *  Returns a 400 if the shuttle cannot be updated.
 *
 * Delete a shuttle
 *  DELETE /shuttle/:id
 *  Returns a 404 if the id is invalid.
 */

import express, {type Response, type Request} from "express"

const router = express.Router()
import prisma from "../prisma_client.js"

router.use(express.json())
router
    .get("/", async (req: Request, res: Response) => {
        // Set our response's content type.
        res.setHeader("Content-Type", "application/json")
        // If no value is found, set it to 2. If one is found, and it can't be made
        // into a number, set it to -1.
        const updatedWithinParam: number = Number(req.query["updatedWithin"] ?? 2) || -1
        // check to make sure the cutoff hours is valid
        // > 1 and <= 1 week
        if (updatedWithinParam < 0 || updatedWithinParam > 1 * 24 * 7) {
            res.status(400).json({"error": "updatedWithin is not valid. Must be between 1 and 168 (1 week) inclusive."})
            return
        }
        const updatedWithinValue = new Date(Date.now()).getTime() - (1000 * 1 * 60 * 60 * updatedWithinParam)
        let shuttles
        try {
            shuttles = await prisma.shuttle.findMany({
                where: {
                    updated: {
                        gte: new Date(updatedWithinValue)
                    }
                },
                orderBy: {
                    id: "asc"
                }
            })
        } catch {
            res.status(500).json({error: "Unable to get shuttles."})
            return
        }

        res.send(shuttles)
    })
    .get("/:id", async (req: Request, res: Response) => {
        // Set our response's content type.
        res.setHeader("Content-Type", "application/json")
        const id: number = Number(req.params.id)
        if (isNaN(id)) {
            res.status(404).json({error: "Invalid shuttle id."})
            return
        }
        const shuttles = await prisma.shuttle.findMany({
            where: {
                id: id
            }
        })

        if (shuttles.length < 1) {
            res.status(404).json({"error": "No shuttle found."})
            return
        }
        res.status(200).json(shuttles)

    })
    .put("/:id", async (req: Request, res: Response) => {
        const {lat, lon, mph, direction} = req.body
        let shuttle;
        let id = Number(req.params.id)
        if (isNaN(id)) {
            res.status(404).json({error: "Invalid shuttle id."})
            return
        }
        try {
            shuttle = await prisma.shuttle.upsert({
                where: {
                    id: id
                },
                update: {
                    lat: lat || 0,
                    lon: lon || 0,
                    mph: mph || 0,
                    direction: direction || 0
                },
                create: {
                    lat: lat || 0,
                    lon: lon || 0,
                    mph: mph || 0,
                    direction: direction || 0
                }
            })
        } catch {
            res.status(400).json({error: "Unable to add/update shuttle."})
            return
        }
        res.status(200).json(shuttle)
    })
    .delete("/:id", async (req: Request, res: Response) => {
        let shuttle;
         let id = Number(req.params.id)
         if (isNaN(id)) {
            res.status(404).json({error: "Invalid shuttle id."})
            return
        }
        try {
            shuttle = await prisma.shuttle.delete({
                where: {
                    id: id
                }
            })
        } catch {
            res.status(404).json({error: "Invalid shuttle id"})
            return
        }
        res.status(200).json(shuttle)
    })
export default router