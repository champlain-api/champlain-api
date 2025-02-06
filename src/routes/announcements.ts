import express, { type Response, type Request } from "express"
const router = express.Router()

router
    .get("/", async (req: Request, res: Response) => {
        // Fetch the announcements from champlain's API
        const champlainAnnouncements = await fetch("https://my.champlain.edu/announcements/api")

        // Set the content-type header and return the annoucements.
        res.set("content-type", "application/json")
        res.json(await champlainAnnouncements.json())
    })


export default router