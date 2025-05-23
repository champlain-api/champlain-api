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

import express from "express";
import type { Response, Request } from "express";
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";
import prisma from "../prisma_client.ts"
import {Prisma, APIKeyScopes} from "@prisma/client";

const router = express.Router();
router.use(express.json())


//Getting all the info
router
.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    let houseGet;
    try {
        houseGet = await prisma.housing.findMany ({
            orderBy: {
                id: "asc"
            }
        })
    } catch {
        res.status(500).json({error: "Unable to get housing data."})
        return
    }
    res.json(houseGet)

 })

 //Getting dorm by name
 .get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    
    if (isNaN(id)) {
        res.status(400).json({error: "Invalid house id."})
        return
    }

    const house = await prisma.housing.findFirst ({
        where: {
            id: id
        }
    })
    if (house == null) {
        res.status(404).json({error: "No house found with that id."})
        return
    }
    res.setHeader("Content-Type", "application/json")
    res.json(house)
})

.get("/name/:name", async (req: Request, res: Response) => {
    try {
        res.setHeader("Content-Type", "application/json")

        const name = req.params.name.toLowerCase();
        const houseInfo = await prisma.housing.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive"
                }
            }
        });
        if (houseInfo) {
            res.json(houseInfo)
        } else {
            res.status(404).json({ "error": "House info not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching housing." });
    }
})

.post("/", requireAPIKeyScopes([APIKeyScopes.HOUSING_EDIT]), async (req: Request, res: Response) => {
    const {name, type, students, distance, address, imageURL} = req.body
    res.setHeader("Content-Type", "application/json")

    let house;
    try {
        house = await prisma.housing.create({
            data: {
                name: name,
                type: type,
                students: students,
                distance: distance,
                address: address,
                imageURL: imageURL
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else if (e instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({error: "Unable to create housing. Please check that all fields are valid."})
            return
        } else {
            res.status(500).json({error: "Unable to create housing. " + e})
        }
    }
    res.status(201).json(house)
    return
}) 

.put("/:id", requireAPIKeyScopes([APIKeyScopes.HOUSING_EDIT]), async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const {name, type, students, distance, address, imageURL} = req.body
    res.setHeader("Content-Type", "application/json")
    if (isNaN(id)) {
        res.status(404).json({error: "Invalid house id."})
        return
    }

    let housing;
    try {
        housing = await prisma.housing.update({
            where: {
                id: id
            },
            data: {
                name: name,
                type: type,
                students: students,
                distance: distance,
                address: address,
                imageURL: imageURL
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else if (e instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({error: "Unable to update housing. Please check that all fields are valid."})
            return
        } else {
            res.status(500).json({error: "Unable to update housing. " + e})
        }
    }
    res.status(200).json({housing})
})

.delete("/:id", requireAPIKeyScopes([APIKeyScopes.HOUSING_EDIT]), async (req: Request, res: Response) => {
    const id: number = Number(req.params.id)
    res.setHeader("Content-Type", "application/json")
    if (isNaN(id)) {
        res.status(404).json({error: "Invalid housing id."})
        return
    }
    let housing;
    try {
        housing = await prisma.housing.delete({
            where: {
                id: id
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else {
            res.status(500).json({error: "Unable to delete housing. " + e})
            return
        }
    }
    res.status(200).send(housing)

})

export default router;
