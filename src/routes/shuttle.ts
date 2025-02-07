import express, { type Response, type Request } from "express"
import type { _ChamplainShuttle, Shuttle } from "../models/shuttle.js"
const router = express.Router()

router.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    const champlainShuttleData = await fetch("https://shuttle.champlain.edu/shuttledata")
    let data = await champlainShuttleData.json()

    let shuttles: Shuttle[] = [];

    for (var oldShuttle of data as _ChamplainShuttle[]) {
        const twoHoursAgo = new Date(Date.now()).getTime() - (1000 * 1 * 60 * 60 * 2)

        // Check if the shuttle is within our cutoff time.
        // If it is, add it to the array so it can be returned
        if (new Date(oldShuttle.Date_Time) > new Date(twoHoursAgo)) {

            // Format it to how we should return our shuttles.
            let newShuttle: Shuttle = Object()
            newShuttle.DateTimeISO = new Date(oldShuttle.Date_Time_ISO)
            newShuttle.Direction = Number(oldShuttle.Direction)
            newShuttle.Lat = oldShuttle.Lat
            newShuttle.Lon = oldShuttle.Lon
            newShuttle.UnitID = Number(oldShuttle.UnitID)
            newShuttle.MPH = Number(oldShuttle.Knots) * 1.15

            shuttles.push(newShuttle)
        }


    }

    res.send(shuttles)
})


export default router