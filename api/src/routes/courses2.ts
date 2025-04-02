import express, { type Request, type Response } from "express";
const router = express.Router();

import prisma from "../prisma_client.ts"
import {type Course, type Semester } from "@prisma/client";



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
 * @description Fetch all courses of a specific course number
 * @param {string} courseNumber - The course number to fetch courses for (e.g., "CSI-240").
 * @returns {JSON} List of courses.
 */
    .get("/courses/:courseNumber", async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")
        
    })

/**
 * @route POST /courses
 * @description adds to the list of all courses
 * @returns {JSON} List of courses.
 */
    .post("/courses", async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json")

    });

export default router
