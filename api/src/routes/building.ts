/*
   Copyright 2025 Champlain API Authors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

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



import express from "express";
import type { Response, Request } from "express";
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";
import prisma from "../prisma_client.ts"
import {Prisma, APIKeyScopes} from "@prisma/client";


const router = express.Router();
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
    .put("/:id", requireAPIKeyScopes([APIKeyScopes.BUILDING_EDIT]), async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        const id = Number(req.params.id)
        const { name, location, hours } = req.body;
        let building;
        try {
            building = await prisma.building.update({
                where: {
                    id: id
                },
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
    .post("/", requireAPIKeyScopes([APIKeyScopes.BUILDING_EDIT]), async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        const { name, location, hours } = req.body
        let building;
        try {
            building = await prisma.building.create({
                data: {
                    name, location, hours
                }
            })
        } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                        res.status(400).json({error: e.meta})
                        return
                    } else if (e instanceof Prisma.PrismaClientValidationError) {
                        res.status(400).json({error: "Unable to create building. Please check that all fields are valid."})
                        return
                    } else {
                        res.status(500).json({error: "Unable to create building. " + e})
                    }
                }
        res.status(201).json(building)
        return
    })
    .delete("/:id", requireAPIKeyScopes([APIKeyScopes.BUILDING_EDIT]), async (req: Request, res: Response) => {
        const id = Number(req.params.id)
        res.setHeader("Content-Type", "application/json")
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid building id." })
            return
        }
        let building;
        try {
            building = await prisma.building.delete({
                where: {
                    id: id
                }
            })
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
                res.status(400).json({ error: e.meta })
                return
            } else {
                res.status(500).json({ error: "Unable to delete building. " + e })
                return
            }
        }
        res.status(200).send(building)

    })

export default router