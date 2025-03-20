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
 *      Returns a 400 if the updatedWithin are invalid.
 *      Returns a 500 if an error occurs
 * 
 * Request a specific shuttle given an ID
 *  GET /shuttles/:id
 *      Returns a 404 if none can be found.
 *      Returns a 400 if the ID is invalid
 *
 * Create a shuttle with
 * the information JSON-encoded in
 * the request body
 *  POST /shuttle
 *      Returns a 400 or 500 if the shuttle cannot be created.
 *
 * Update a shuttle with
 * the information JSON-encoded in
 * the request body
 *  PUT /shuttle/:id
 *      Returns a 400 or 500 if an error occurs.
 *
 * Delete a shuttle
 *  DELETE /shuttle/:id
 *      Returns a 400 if the id is invalid.
 *      Returns a 400 or 500 if an error occurs.
 */

import express, {type Response, type Request, type NextFunction} from "express"

const router = express.Router()
import prisma from "../prisma_client.js"
import {requireAPIKeyScopes} from "../middleware/api-middleware.js";
import {APIKeyScopes, Prisma} from "@prisma/client";

router.use(express.json())

router
    .get("/", async (req: Request, res: Response) => {
        // Set our response's content type.
        res.setHeader("Content-Type", "application/json")
        // If no value is found, set it to 2
        const updatedWithinParam: number = Number(req.query["updatedWithin"] ?? 2)

        // check to make sure the hours valid (> 1 hour and <= 1 week)
        if (isNaN(updatedWithinParam) || updatedWithinParam <= 0 || updatedWithinParam > 1 * 24 * 7) {
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
            res.send(shuttles)

        } catch {
            res.status(500).json({error: "Unable to get shuttles."})
            return
        }

    })
    .get("/:id", async (req: Request, res: Response) => {
        // Set our response's content type.
        res.setHeader("Content-Type", "application/json")
        const id: number = Number(req.params.id)
        if (isNaN(id)) {
            res.status(400).json({error: "Invalid shuttle id."})
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
    .post("/", requireAPIKeyScopes([APIKeyScopes.SHUTTLE_EDIT]), async (req: Request, res: Response) => {
        const {lat, lon, mph, direction} = req.body

        try {
            let shuttle = await prisma.shuttle.create({
                data: {
                    lat: lat || 0,
                    lon: lon || 0,
                    mph: mph || 0,
                    direction: direction || 0
                }
            })
            res.status(200).json(shuttle)
            return
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({error: e.meta})
                return
            } else if (e instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({error: "Unable to create shuttle. Please check that all fields are valid."})
                return
            } else {
                res.status(500).json({error: "Unable to create shuttle. " + e})
                return
            }
        }
    })
    .put("/:id", requireAPIKeyScopes([APIKeyScopes.SHUTTLE_EDIT]), async (req: Request, res: Response) => {
        const {lat, lon, mph, direction} = req.body
        let id = Number(req.params.id)
        if (isNaN(id)) {
            res.status(400).json({error: "Invalid shuttle id."})
            return
        }
        try {
            let shuttle = await prisma.shuttle.update({
                where: {
                    id: id
                },
                data: {
                    lat: lat || 0,
                    lon: lon || 0,
                    mph: mph || 0,
                    direction: direction || 0
                }
            })
            res.status(201).json(shuttle)
            return
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({error: e.meta})
                return
            } else if (e instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({error: "Unable to update shuttle. Please check that all fields are valid."})
                return
            } else {
                res.status(500).json({error: "Unable to update shuttle. " + e})
                return
            }
        }
    })
    .delete("/:id", requireAPIKeyScopes([APIKeyScopes.SHUTTLE_EDIT]), async (req: Request, res: Response) => {
        let shuttle;
        let id = Number(req.params.id)
        if (isNaN(id)) {
            res.status(400).json({error: "Invalid shuttle id."})
            return
        }
        try {
            let shuttle = await prisma.shuttle.delete({
                where: {
                    id: id
                }
            })
            res.status(200).json(shuttle)
            return
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({error: "Unable to delete: " + e.meta})
                return
            } else {
                res.status(500).json({error: "Unable to delete shuttle. " + e})
                return
            }
        }
    })
export default router