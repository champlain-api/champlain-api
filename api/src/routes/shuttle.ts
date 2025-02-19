/*
 * shuttle.ts
 * This defines the routes for the shuttle endpoint.
 * 
 * Users can do the following:
 * 
 * Request all shuttles
 * GET /shuttles
 *  Parameters:
 *      updatedWithin: Int - only show shuttles updated within the past X hours. Defaults to 2.
 *      Returns a 400 if the updatedWithin are invalid.
 * 
 * Request a specific shuttle given a ID
 * GET /shuttles/:id
 *  Returns a 404 if the ID is invalid.
 * 
 */

import express, { type Response, type Request } from "express"
import type { _ChamplainShuttle, Shuttle } from "../types/shuttle.d.ts"
const router = express.Router()

router
    .get("/", async (req: Request, res: Response) => {
        // Set our response's content type.
        res.setHeader("Content-Type", "application/json")

        const champlainShuttleData = await fetch("https://shuttle.champlain.edu/shuttledata", {
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await champlainShuttleData.json()

        let shuttles: Shuttle[] = [];

        // If no value is found, set it to 2. If one is found, and it can't be made
        // into a number, set it to -1.
        const updatedWithinParam: number = Number(req.query["updatedWithin"] ?? 2) || -1
        // check to make sure the cutoff hours is valid
        // > 1 and <= 1 week
        if (updatedWithinParam < 0 || updatedWithinParam > 1 * 24 * 7) {
            res.status(400).json({ "error": "updatedWithin is not valid. Must be between 1 and 168 (1 week) inclusive." })
            return
        }
        const updatedWithinValue = new Date(Date.now()).getTime() - (1000 * 1 * 60 * 60 * updatedWithinParam)

        for (var oldShuttle of data as _ChamplainShuttle[]) {
            // Check if the shuttle is within our cutoff time.
            // If it is, add it to the array so it can be returned
            const isWithinCutoffTime = new Date(oldShuttle.Date_Time) > new Date(updatedWithinValue)

            if (isWithinCutoffTime) {
                // Format it to how we should return our shuttles.
                let newShuttle: Shuttle = makeNewShuttle(oldShuttle)
                shuttles.push(newShuttle)
            }


        }
        res.send(shuttles)
    })
    .get("/:id", async (req: Request, res: Response) => {
        // Set our response's content type.
        res.setHeader("Content-Type", "application/json")

        const champlainShuttleData = await fetch("https://shuttle.champlain.edu/shuttledata", {
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await champlainShuttleData.json()
        for (var shuttle of data as _ChamplainShuttle[]) {
            if (shuttle.UnitID == req.params["id"]) {
                res.json(makeNewShuttle(shuttle))
                return
            }
        }

        res.status(404).json({ "error": "No shuttle found." })
    })

/**
 * @description Creates and returns a new shuttle object from an
 * old Champlain one.
 * @param oldShuttle the old {@link _ChamplainShuttle}
 * @returns a new {@link Shuttle}
 */
function makeNewShuttle(oldShuttle: _ChamplainShuttle): Shuttle {
    let newShuttle: Shuttle = Object()
    newShuttle.updated = new Date(oldShuttle.Date_Time_ISO)
    newShuttle.direction = Number(oldShuttle.Direction)
    newShuttle.lat = Number(oldShuttle.Lat)
    newShuttle.lon = Number(oldShuttle.Lon)
    newShuttle.id = Number(oldShuttle.UnitID)
    newShuttle.mph = Number((Number(oldShuttle.Knots) * 1.15).toFixed(2))
    return newShuttle
}

export default router