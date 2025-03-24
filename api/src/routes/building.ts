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



import express, {type Response, type Request} from "express"

const router = express.Router()
import prisma from "../prisma_client.ts"
import {Prisma} from '@prisma/client'
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";
import {AnnouncementType, APIKeyScopes} from "@prisma/client";

router.use(express.json())

router.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
     
})