import {type Response, type Request, type NextFunction} from "express"

import prisma from "../prisma_client.ts"
import {APIKeyScopes} from "@prisma/client";

export function requireAPIKeyScopes(requiredScopes: APIKeyScopes[]) {
    return async function (req: Request, res: Response, next: NextFunction) {

        const authHeader = req.headers.authorization

        /**
         * The API key the user sends in the Auth header.
         */
        const sentAPIKey = authHeader?.split("Bearer ")[1]
        if (authHeader == null || sentAPIKey == null) {
            res.status(401).json({error: "Invalid API key."})
            return
        }

        /**
         * The API key that prisma returns
         */
        const returnedAPIKey = await prisma.apiKey.findUnique({
            where: {
                key: sentAPIKey
            },
            select: {
                scopes: true
            }
        })

        if (returnedAPIKey == null) {
            res.status(401).json({error: "Invalid API key."})
            return
        }

        // If every required scope is not included in the list of scopes
        // sent by the user, return 403.
        if (!requiredScopes.every(el => returnedAPIKey.scopes.includes(el))) {
            res.status(403).json({error: "Missing required scope(s)."})
            return
        }

        next()
    }
}


