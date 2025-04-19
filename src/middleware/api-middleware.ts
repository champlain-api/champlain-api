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


