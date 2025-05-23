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
import express, {type Request, type Response} from "express";
import announcementsRoute from "./routes/announcements.ts"
import shuttleRoute from "./routes/shuttle.ts"
import facultyRoute from "./routes/faculty.ts"
import rootRoute from "./routes/root.ts"
import courseRoutes from "./routes/courses.ts"
import buildingRoute from "./routes/building.ts"
import housingRoute from "./routes/housing.ts"
import competenciesRoute from "./routes/competencies.ts"
import diningRoute from "./routes/dining.ts"
import clubsRoutes from './routes/clubs.ts';


const app = express()

app.use("/", rootRoute)
app.use("/announcements", announcementsRoute)
app.use("/shuttles", shuttleRoute)
app.use("/course", courseRoutes);
app.use("/faculty", facultyRoute)
app.use("/course", courseRoutes);
app.use("/building", buildingRoute)
app.use("/housing", housingRoute)
app.use("/competencies", competenciesRoute)
app.use("/dining-menu-idx", diningRoute)
app.use('/clubs', clubsRoutes);


app.listen(3000, () => {
    console.log("API running on :3000!")
})

export {app}
