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
    let competencyGet;
    try {
        competencyGet = await prisma.competencies.findMany ({
            orderBy: {
                id: "asc"
            }
        })
    } catch {
        res.status(500).json({error: "Unable to get competency data."})
        return
    }
    res.json(competencyGet)

 })
 .get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    
    if (isNaN(id)) {
        res.status(400).json({error: "Invalid competency id."})
        return
    }

    const competencies = await prisma.competencies.findFirst ({
        where: {
            id: id
        }
    })
    if (competencies == null) {
        res.status(404).json({error: "No competency found with that id."})
        return
    }
    res.setHeader("Content-Type", "application/json")
    res.json(competencies)
})

.get("/competency/:competency", async (req: Request, res: Response) => {
    try {
        res.setHeader("Content-Type", "application/json")

        const competency = req.params.competency.toLowerCase();
        const competencyInfo = await prisma.competencies.findFirst({
            where: {
                competency: {
                    equals: competency,
                    mode: "insensitive"
                }
            }
        });
        if (competencyInfo) {
            res.json(competencyInfo)
        } else {
            res.status(404).json({ "error": "Competency info not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching competency." });
    }
})

.post("/", requireAPIKeyScopes([APIKeyScopes.COMPETENCIES_EDIT]), async (req: Request, res: Response) => {
    const {competency, description, criteria, information} = req.body
    res.setHeader("Content-Type", "application/json")

    let competencies;
    try {
        competencies = await prisma.competencies.create({
            data: {
                competency: competency,
                description: description,
                criteria: criteria,
                information: information
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else if (e instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({error: "Unable to create competency. Please check that all fields are valid."})
            return
        } else {
            res.status(500).json({error: "Unable to create competency. " + e})
        }
    }
    res.status(201).json(competencies)
    return
}) 

.put("/:id", requireAPIKeyScopes([APIKeyScopes.COMPETENCIES_EDIT]), async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const {competency, description, criteria, information} = req.body
    res.setHeader("Content-Type", "application/json")
    if (isNaN(id)) {
        res.status(404).json({error: "Invalid competency id."})
        return
    }

    let competencies;
    try {
        competencies = await prisma.competencies.update({
            where: {
                id: id
            },
            data: {
                competency: competency,
                description: description,
                criteria: criteria,
                information: information
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else if (e instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({error: "Unable to update competency. Please check that all fields are valid."})
            return
        } else {
            res.status(500).json({error: "Unable to update competency. " + e})
        }
    }
    res.status(200).json({competencies})
})

.delete("/:id", requireAPIKeyScopes([APIKeyScopes.COMPETENCIES_EDIT]), async (req: Request, res: Response) => {
    const id: number = Number(req.params.id)
    res.setHeader("Content-Type", "application/json")
    if (isNaN(id)) {
        res.status(404).json({error: "Invalid competency id."})
        return
    }
    let competencies;
    try {
        competencies = await prisma.competencies.delete({
            where: {
                id: id
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else {
            res.status(500).json({error: "Unable to delete competency. " + e})
            return
        }
    }
    res.status(200).send(competencies)

})

export default router;
 