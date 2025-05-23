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

/*
This defines the routes for the courses endpoint.`

Users can do the following:

Request all courses
 *  GET /courses
 *      Returns a 500 if an error occurs.
 * 
Request a specific course
 * GET /courses/:courseNumber
 *     Returns a 400 if the course number is not provided.
 *     Returns a 404 if the semester is not found.
 *     Returns a 500 if an error occurs.
 * 
Post a specific course
 * POST /courses
 *    Returns a 400 if some data is not provided.
 *    Returns a 404 if the semester is not found.
 *    Returns a 500 if an error occurs.
 *    Returns a 201 if the course is created successfully.
 * 
Change a specific course
 * PUT /courses/:courseId
 *    Returns a 400 if the course ID is not provided.
 *    Returns a 404 if the course is not found.
 *    Returns a 500 if an error occurs.
 *    Returns a 200 if the course is updated successfully.
 * 
Delete a specific course
 * DELETE /courses/:courseId
 *    Returns a 400 if the course ID is not provided.
 *    Returns a 404 if the course is not found.
 *    Returns a 500 if an error occurs.
 *    Returns a 200 if the course is deleted successfully.
*/


import prisma from "../prisma_client.ts"
import {type Course, type Semester } from "@prisma/client";
import {Prisma, APIKeyScopes} from "@prisma/client";
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";
import express, { type Request, type Response } from "express";

const router = express.Router();


router.use(express.json())
router
/**
 * @route GET /courses
 * @description Fetch all courses
 * @returns {JSON} List of courses.
 */
    .get("/", async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        
        let semesters: Semester[];

        try {
            semesters = await prisma.semester.findMany({
                orderBy: {
                    id: "asc"
                },
                include: {
                    courses: {
                        orderBy: {
                            number: "asc"
                        }
                    }
                }
            });
        }    
        catch {
            res.status(500).json({error: "Unable to get courses."})
            return
        }
        res.json(semesters)
    })

/**
 * @route GET /:courseNumber
 * @description Fetch a course by its course number, nested inside semesters
 * @param {string} courseNumber - The course number to fetch (e.g., "CSI-240").
 * @returns {JSON} The course details with its semester.
 */
    .get("/:courseNumber", async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");

        const courseNumber = req.params.courseNumber;
        if (!courseNumber) {
            res.status(400).json({ error: "Course number is required." });
            return;
        }

        try {
            // Search for the course within semesters
            const course = await prisma.course.findFirst({
                where: {
                    number: courseNumber
                },
                include: {
                    semester: true // Include the related semester
                }
            });

            if (!course) {
                res.status(404).json({ error: "Course not found." });
                return;
            }

            res.json(course);
        } catch (error) {
            res.status(500).json({ error: "Unable to fetch the course." });
        }
    })

/**
 * @route POST /courses
 * @description Adds a new course to a specific semester
 * @returns {JSON} A success message with the updated course or an error.
 */
    .post("/courses", requireAPIKeyScopes([APIKeyScopes.COURSES_EDIT]), async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");

        const {
            title,
            number,
            credit,
            openseats,
            days,
            times,
            instructor_name,
            description,
            room,
            subject,
            type,
            prereq,
            start_date,
            end_date,
            semesterId
        } = req.body;

        // Validate required fields
        if (!title || !number || !semesterId) {
            res.status(400).json({ error: "Missing required fields: title, number, or semesterId." });
            return;
        }

        // Validate dates
        if (isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
            res.status(400).json({ error: "Invalid start_date or end_date." });
            return;
        }

        try {
            // Check if the semester exists
            const semester = await prisma.semester.findUnique({
                where: { id: semesterId }
            });

            if (!semester) {
                res.status(404).json({ error: "Semester not found. Please provide a valid semesterId." });
                return;
            }

            // Create the new course
            const newCourse = await prisma.course.create({
                data: {
                    title,
                    number,
                    credit,
                    openseats,
                    days,
                    times,
                    instructor_name,
                    description,
                    room,
                    subject,
                    type,
                    prereq,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    semesterId // Associate the course with the semester
                }
            });

            res.status(201).json(newCourse);
        } catch (error) {
            res.status(500).json({ error: "Unable to create the course." });
        }
    })

/**
 * @route PUT /:courseId
 * @description Updates an existing course by its ID
 * @param {number} courseId - The ID of the course to update.
 * @returns {JSON} A success message with the updated course or an error.
 */
router.put("/courses/:courseId", requireAPIKeyScopes([APIKeyScopes.COURSES_EDIT]), async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    const courseId = parseInt(req.params.courseId, 10);
    const {
        title,
        number,
        credit,
        openseats,
        days,
        times,
        instructor_name,
        description,
        room,
        subject,
        type,
        prereq,
        start_date,
        end_date,
        semesterId
    } = req.body;

    if (isNaN(courseId)) {
        res.status(400).json({ error: "Invalid course ID." });
        return;
    }

    try {
        // Check if the course exists
        const existingCourse = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!existingCourse) {
            res.status(404).json({ error: "Course not found." });
            return;
        }

        // Update the course
        const updatedCourse = await prisma.course.update({
            where: { id: courseId },
            data: {
                title,
                number,
                credit,
                openseats,
                days,
                times,
                instructor_name,
                description,
                room,
                subject,
                type,
                prereq,
                start_date: start_date ? new Date(start_date) : undefined,
                end_date: end_date ? new Date(end_date) : undefined,
                semesterId,
            },
        });

        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: "Unable to update the course." });
    }
});

/**
 * @route DELETE /:courseId
 * @description Deletes a course by its ID
 * @param {number} courseId - The ID of the course to delete.
 * @returns {JSON} A success message or an error.
 */
router.delete("/courses/:courseId", requireAPIKeyScopes([APIKeyScopes.COURSES_EDIT]), async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    const courseId = parseInt(req.params.courseId, 10);

    if (isNaN(courseId)) {
        res.status(400).json({ error: "Invalid course ID." });
        return;
    }

    try {
        // Check if the course exists
        const existingCourse = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!existingCourse) {
            res.status(404).json({ error: "Course not found." });
            return;
        }

        // Delete the course
        await prisma.course.delete({
            where: { id: courseId },
        });

        res.status(200).json({ message: "Course deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Unable to delete the course." });
    }
});



/**
 * the semesters will all start with /semester/... simply for clarity
 */



/**
 * @route POST /semester
 * @description Adds a new semester
 * @returns {JSON} A success message or an error.
 */
router.post("/semester", requireAPIKeyScopes([APIKeyScopes.COURSES_EDIT]), async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    const { name, year, date } = req.body;

    // Validate required fields
    if (!name || !year || !date) {
        res.status(400).json({ error: "Missing required fields: name, year, or date." });
        return;
    }

    try {
        // Create the new semester
        const newSemester = await prisma.semester.create({
            data: {
                name,
                year,
                date,
            },
        });

        res.status(201).json(newSemester);
    } catch (error) {
        res.status(500).json({ error: "Unable to create the semester." });
    }
});

/**
 * @route PUT /semester/:semesterId
 * @description Updates an existing semester by its ID
 * @param {number} semesterId - The ID of the semester to update.
 * @returns {JSON} A success message or an error.
 */
router.put("/semester/:semesterId", requireAPIKeyScopes([APIKeyScopes.COURSES_EDIT]), async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    const semesterId = parseInt(req.params.semesterId, 10);
    const { name, year, date } = req.body;

    if (isNaN(semesterId)) {
        res.status(400).json({ error: "Invalid semester ID." });
        return;
    }

    try {
        // Check if the semester exists
        const existingSemester = await prisma.semester.findUnique({
            where: { id: semesterId },
        });

        if (!existingSemester) {
            res.status(404).json({ error: "Semester not found." });
            return;
        }

        // Update the semester
        const updatedSemester = await prisma.semester.update({
            where: { id: semesterId },
            data: {
                name,
                year,
                date,
            },
        });

        res.status(200).json(updatedSemester);
    } catch (error) {
        res.status(500).json({ error: "Unable to update the semester." });
    }
});

/**
 * @route GET /semester
 * @description Returns all existing semesters
 * @returns {JSON} A list of semesters or an error.
 */
router.get("/semester", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    try {
        const semesters = await prisma.semester.findMany({
            orderBy: {
                id: "asc",
            },
        });

        res.status(200).json(semesters);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch semesters." });
    }
});

/**
 * @route GET /semester/:semesterId
 * @description Returns an existing semester by its ID
 * @param {number} semesterId - The ID of the semester to fetch.
 * @returns {JSON} The semester details or an error.
 */
router.get("/semester/:semesterId", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    const semesterId = parseInt(req.params.semesterId, 10);

    if (isNaN(semesterId)) {
        res.status(400).json({ error: "Invalid semester ID." });
        return;
    }

    try {
        const semester = await prisma.semester.findUnique({
            where: { id: semesterId },
        });

        if (!semester) {
            res.status(404).json({ error: "Semester not found." });
            return;
        }

        res.status(200).json(semester);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch the semester." });
    }
});

/**
 * @route DELETE /semester/:semesterId
 * @description Deletes a semester by its ID
 * @param {number} semesterId - The ID of the semester to delete.
 * @returns {JSON} A success message or an error.
 */
router.delete("/semester/:semesterId", requireAPIKeyScopes([APIKeyScopes.COURSES_EDIT]), async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    const semesterId = parseInt(req.params.semesterId, 10);

    if (isNaN(semesterId)) {
        res.status(400).json({ error: "Invalid semester ID." });
        return;
    }

    try {
        // Check if the semester exists
        const existingSemester = await prisma.semester.findUnique({
            where: { id: semesterId },
        });

        if (!existingSemester) {
            res.status(404).json({ error: "Semester not found." });
            return;
        }

        // Delete the semester
        await prisma.semester.delete({
            where: { id: semesterId },
        });

        res.status(200).json({ message: "Semester deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Unable to delete the semester." });
    }
});

export default router
