import {type Response, type Request, type NextFunction} from "express"

import prisma from "../prisma_client.ts"
import {APIKeyScopes} from "@prisma/client";

export function requireAPIKeyScopes(requiredScopes: APIKeyScopes[]) {
    return async function (req: Request, res: Response, next: NextFunction) {

        const authHeader = req.headers.authorization
        const apiKey = authHeader?.split("apikey ")[1]
        if (authHeader == null || apiKey == null) {
            res.status(403).json({error: "Invalid API key."})
            return
        }
        const givenAPIKey = await prisma.apiKey.findUnique({
            where: {
                key: apiKey
            },
            select: {
                scopes: true
            }
        })

        if (givenAPIKey == null) {
            res.status(403).json({error: "Invalid API key."})
            return
        }

        // If every required scope is not included in the list of scopes
        // sent by the user, return 403.
        if (!requiredScopes.every(el => givenAPIKey.scopes.includes(el))) {
            res.status(403).json({error: "Missing scope."})
            return
        }

        next()
    }
}


