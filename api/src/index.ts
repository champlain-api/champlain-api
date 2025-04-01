import express, {} from "express";
import announcementsRoute from "./routes/announcements.ts"
import shuttleRoute from "./routes/shuttle.ts"
import facultyRoute from "./routes/faculty.ts"
import rootRoute from "./routes/root.ts"
import idxMenuRoute from "./routes/dining.ts"
const app = express()
app.use("/", rootRoute)
app.use("/announcements", announcementsRoute)
app.use("/shuttles", shuttleRoute)
app.use("/faculty", facultyRoute)
app.use("/dining-menu-idx", idxMenuRoute)
app.listen(3000, () => {
    console.log("API running on :3000!")
})
