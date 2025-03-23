/*
 * announcements.ts
 * This defines the routes for the announcements endpoint.
 *
 * Users can do the following:
 *
 * Request all announcements
 *  GET /announcements
 *      Returns a 400 or 500 if an error occurs.
 *
 *      The user can also specify a 'type' parameter which
 *      includes an *array* of strings of type AnnouncementType (defined in the prisma schema).
 *          Returns a 400 if they are not valid.
 *
 *
 * Request a specific announcement given an ID
 *  GET /announcements/:id
 *      Returns a 404 if none can be found.
 *      Returns a 400 if the ID is invalid
 *
 * Create an announcement with information
 * JSON-encoded in the body of a request.
 *  POST /announcements
 *      Returns a 400 or 500 if an error occurs.
 *
 * Edit an announcement given the id.
 *  PUT /announcements/:id
 *      Returns a 400 if the ID is invalid.
 *      Returns 404 if none can be found
 *      Returns a 400 or 500 if an error occurs.
 *
 * Delete an announcement given the id.
 *  DELETE /announcements/:id
 *      Returns a 400 if the ID is invalid.
 *      Returns a 400 or 500 if an error occurs.
 *
 */
import express, {type Response, type Request} from "express"

const router = express.Router()
import prisma from "../prisma_client.ts"
import {Prisma} from '@prisma/client'
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";
import {AnnouncementType, APIKeyScopes} from "@prisma/client";

router.use(express.json())

router
    .get("/", async (req: Request, res: Response) => {
        // Fetch the announcements from the database
        res.setHeader("Content-Type", "application/json")
        const typeFilter = req.query["type"] || [AnnouncementType.WEB, AnnouncementType.SHUTTLE, AnnouncementType.MOBILE]

        // Check if the type was given as an array.
        if (!(typeFilter instanceof Array)) {
            res.status(400).json({error: "'type' property is not an array."})
            return
        }
        // Now check if the array contains those only of AnnouncementType
        const hasValidTypes = typeFilter.every(el => Object.values(AnnouncementType).includes(el as AnnouncementType))
        if (!hasValidTypes) {
            res.status(400).json({error: "'type' property contains invalid values."})
            return
        }
        let announcements;
        try {
            announcements = await prisma.announcement.findMany({
                orderBy: {
                    id: "asc"
                },
                where: {
                    type: {
                        hasSome: typeFilter as AnnouncementType[]
                    }
                }
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({error: e.meta})
                return
            } else {
                res.status(500).json({error: "Unable to get announcement."})
                return
            }
        }
        // Set the content-type header and return the announcements.
        res.json(announcements)
    })
    .get("/:id", async (req: Request, res: Response) => {
        const id = Number(req.params.id)
        if (isNaN(id)) {
            res.status(400).json({error: "Invalid announcement id."})
            return
        }
        const announcement = await prisma.announcement.findFirst({
            where: {
                id: id
            }
        })
        if (announcement == null) {
            res.status(404).json({error: "No announcement found with that id."})
            return
        }

        res.setHeader("Content-Type", "application/json")
        res.json(announcement)
    })
    .post("/", requireAPIKeyScopes([APIKeyScopes.ANNOUNCEMENTS_EDIT]), async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")

        const {title, description, type, style} = req.body

        let announcement;
        try {
            announcement = await prisma.announcement.create({
                data: {
                    title: title,
                    description: description,
                    type: type,
                    style: style
                }
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({error: e.meta})
                return
            } else if (e instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({error: "Unable to create announcement. Please check that all fields are valid."})
                return
            } else {
                res.status(500).json({error: "Unable to create announcement. " + e})
            }
        }
        res.status(200).json(announcement)
        return
    })
    .put("/:id", requireAPIKeyScopes([APIKeyScopes.ANNOUNCEMENTS_EDIT]), async (req: Request, res: Response) => {
        const id = Number(req.params.id)
        const {title, description, type, style} = req.body
        res.setHeader("Content-Type", "application/json")
        if (isNaN(id)) {
            res.status(400).json({error: "Invalid announcement id."})
            return
        }

        let announcement;
        try {
            announcement = await prisma.announcement.update({
                where: {
                    id: id
                },
                data: {
                    title: title,
                    description: description,
                    type: type,
                    style: style

                }
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({error: e.meta})
                return
            } else if (e instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({error: "Unable to update announcement. Please check that all fields are valid."})
                return
            } else {
                res.status(500).json({error: "Unable to update announcement. " + e})
            }
        }
        res.status(200).json({announcement})
    })
    .delete("/:id", requireAPIKeyScopes([APIKeyScopes.ANNOUNCEMENTS_EDIT]), async (req: Request, res: Response) => {
        const id = Number(req.params.id)
        res.setHeader("Content-Type", "application/json")
        if (isNaN(id)) {
            res.status(400).json({error: "Invalid announcement id."})
            return
        }
        let announcement;
        try {
            announcement = await prisma.announcement.delete({
                where: {
                    id: id
                }
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({error: e.meta})
                return
            } else {
                res.status(500).json({error: "Unable to delete announcement. " + e})
                return
            }
        }
        res.status(200).send(announcement)

    })


export default router