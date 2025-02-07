import express, { type Response, type Request } from "express"
import type { _ChamplainShuttle, Shuttle } from "../types/shuttle.d.ts"
const router = express.Router()

router.get("/", async (req: Request, res: Response) => {
    // Set our response's content type.
    res.setHeader("Content-Type", "application/json")

    const champlainShuttleData = await fetch("https://shuttle.champlain.edu/shuttledata", {
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await champlainShuttleData.json()

    let shuttles: Shuttle[] = [];

    // Return 2 if the functions fails (such as returns NaN) or if the user provides no number
    const cutoffHours = Number(req.query["cutoffHours"] ?? 2) || 2
    // check to make sure the cutoff hours is valid
    // > 1 and <= 1 week (168 hours)
    if (cutoffHours < 1 || cutoffHours >= 1 * 24 * 7) {
        res.status(400).json({ "error": "cutoffHours is not valid." })
    }
    const twoHoursAgo = new Date(Date.now()).getTime() - (1000 * 1 * 60 * 60 * cutoffHours)

    for (var oldShuttle of data as _ChamplainShuttle[]) {
        // Check if the shuttle is within our cutoff time.
        // If it is, add it to the array so it can be returned
        const isWithinCutoffTime = new Date(oldShuttle.Date_Time) > new Date(twoHoursAgo)

        if (isWithinCutoffTime) {
            // Format it to how we should return our shuttles.
            let newShuttle: Shuttle = Object()
            newShuttle.DateTime = new Date(oldShuttle.Date_Time_ISO)
            newShuttle.Direction = oldShuttle.Direction
            newShuttle.Lat = oldShuttle.Lat
            newShuttle.Lon = oldShuttle.Lon
            newShuttle.UnitID = Number(oldShuttle.UnitID)
            newShuttle.MPH = String((Number(oldShuttle.Knots) * 1.15).toFixed(2))

            shuttles.push(newShuttle)
        }


    }
    res.send(shuttles)
})


export default router