/*
courses2.ts because the first one was a failure

This defines the routes for the courses endpoint.`

Users can do the following:

Request all courses
 *  GET /courses
 *      Returns a 500 if an error occurs.
 * 
Request a specific semesters worth of courses
 * GET /courses/:semester
 *     (incomplete)
 *     Returns a 500 if an error occurs.
 * 
Request a specific course
 * GET /courses/:courseNumber
 *     (incomplete)
 * 
Post a specific course
 * POST /courses
 *     (incomplete)

*/


import prisma from "../prisma_client.ts"
import {type Course, type Semester } from "@prisma/client";
import {Prisma, APIKeyScopes} from "@prisma/client";
import {requireAPIKeyScopes} from "../middleware/api-middleware.js";
import express, { type Request, type Response } from "express";

const router = express.Router();


router.use(express.json())
router
/**
 * @route GET /courses
 * @description Fetch all courses
 * @returns {JSON} List of courses.
 */
    .get("/courses", async (req: Request, res: Response) => {
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
 * @route GET /courses/:semester
 * @description Fetch all courses of a specific semester
 * @param {string} semesterId - The ID of the semester to fetch courses for. * @returns {JSON} List of courses.
 * @returns {JSON} List of courses. 
*/
    .get("/courses/:semester", async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");

        const semesterId = parseInt(req.params.semesterId, 10);
        if (isNaN(semesterId)) {
            res.status(400).json({ error: "Invalid semester ID." });
            return;
        }

        let semester: Semester | null;
        try {
            semester = await prisma.semester.findUnique({
                where: {
                    id: semesterId
                },
                include: {
                    courses: {
                        orderBy: {
                            number: "asc"
                        }
                    }
                }
            });
        if (!semester) {
            res.status(404).json({ error: "Semester not found." });
            return;
        }
        } catch (error) {
            res.status(500).json({ error: "Unable to get courses for the specified semester." });
            return;
        }
        res.json(semester);
    })

/**
 * @route GET /courses/:courseNumber
 * @description Fetch a course by its course number, nested inside semesters
 * @param {string} courseNumber - The course number to fetch (e.g., "CSI-240").
 * @returns {JSON} The course details with its semester.
 */
    .get("/courses/:courseNumber", async (req: Request, res: Response) => {
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
 * @returns {JSON} The created course.
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
    });

export default router
