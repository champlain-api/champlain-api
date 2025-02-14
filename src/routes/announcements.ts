import express, { type Response, type Request } from "express"
const router = express.Router()
import type { _ChamplainAnnouncement, Announcement } from "../types/announcements.d.ts"
router
    .get("/", async (req: Request, res: Response) => {
        // Fetch the announcements from champlain's API
        const announcementRequest = await fetch("https://my.champlain.edu/announcements/api")
        //@ts-ignore
        // we dont define a 'response' type from the Champlain
        // announcement API. It returns a status string and an array
        // of announcements. We only want the announcements.
        const champlainAnnouncements: _ChamplainAnnouncement[] = (await announcementRequest.json() as _ChamplainAnnouncement[])["data"]

        let annoucements: Announcement[] = []
        for (const oldAnnouncement of champlainAnnouncements as _ChamplainAnnouncement[]) {
            const announcement: Announcement = {
                description: oldAnnouncement.summary,
                id: oldAnnouncement.id,
                title: oldAnnouncement.title,
                style: oldAnnouncement.style,
                type: oldAnnouncement.type
            }
            annoucements.push(announcement)
        }


        // Set the content-type header and return the annoucements.
        res.setHeader("Content-Type", "application/json")
        res.json(annoucements)


    })
    .get("/:id", async (req: Request, res: Response) => {
        // Fetch the announcements from champlain's API
        const champlainAnnouncements = await fetch("https://my.champlain.edu/announcements/api")

        // Set the content-type header and return the annoucements.
        res.setHeader("Content-Type", "application/json")
        const id: number = Number(req.params.id) || -1


        //@ts-ignore
        // we dont define a 'response' type from the Champlain
        // announcement API. It returns a status string and an array
        // of announcements. We only want the announcements.
        const announcements: _ChamplainAnnouncement[] = (await champlainAnnouncements.json() as _ChamplainAnnouncement[])["data"]

        const foundAnnouncements = announcements.filter(el => el.id == id)
        foundAnnouncements.length == 0
            ? res.sendStatus(404)
            : res.json(foundAnnouncements)
    })



export default router