import express, { type Request, type Response } from "express";
import announcementsRoute from "./routes/announcements.ts"
import shuttleRoute from "./routes/shuttle.ts"
const app = express()

app.get("/", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/plain")
    response.status(200).send("Champlain API");
})


app.use("/announcements", announcementsRoute)
app.use("/shuttles", shuttleRoute)

app.listen(3000, () => {
    console.log("API running on :3000!")
})