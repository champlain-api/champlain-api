import express, { type Request, type Response } from "express";
import announcementsRoute from "./routes/announcements.ts"
const app = express()

app.get("/", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/plain")
    response.status(200).send("Champlain API");
})


app.use("/announcements", announcementsRoute)

app.listen(3000, () => {
    console.log("API running on :3000!")
})