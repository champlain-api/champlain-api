import express from "express";
import type { Response, Request } from "express";
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";
import prisma from "../prisma_client.ts"
import {Prisma, APIKeyScopes} from "@prisma/client";

const router = express.Router();
console.log(APIKeyScopes);


router.use(express.json())
// Route to get all faculty data
router
.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    let facultyGet;
    try {
        facultyGet = await prisma.faculty.findMany({
            orderBy: {
                id: "asc"
            }
        })
    } catch {
        res.status(500).json({error: "Unable to get faculty."})
        return
    }
    res.json(facultyGet)
 })
 
 .get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)

    if (isNaN(id)) {
        res.status(400).json({error: "Invalid faculty id."})
        return
    }
    
    const faculty = await prisma.faculty.findFirst ({
        where: {
            id: id
        }
    })
    if (faculty == null) {
        res.status(404).json({error: "No faculty found with that id."})
        return
    }
    res.setHeader("Content-Type", "application/json")
    res.json(faculty)
 })

// Route to get a specific faculty member by name
.get("/:name", async (req: Request, res: Response) => {
    try {
        res.setHeader("Content-Type", "application/json");

        const name = req.params.name.toLowerCase();
        const facultyMember = await prisma.faculty.findMany({
            where: {
                name: name
            }
            
        });

        if (facultyMember.length > 0) {
            res.json(facultyMember);
        } else {
            res.status(404).json({ "error": "Faculty member not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching faculty." });

    }
})

// Route to get faculty members by department
.get("/department/?=departmentName", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    try{
    // Normalize the department name
        const departmentName = req.params.departmentName.trim().toLowerCase();

        const filteredFaculty = await prisma.faculty.findMany({
            where: {
                departments: {
                    has: departmentName
                }
            }
        });
        if (filteredFaculty.length > 0) {
            res.json(filteredFaculty);
        } else {
            res.status(404).json({ "error": "No faculty members found for this department." });
        }
    } catch (error) {
        res.status(500).json({error: "Error fetching faculty."})
    }
})

.post("/", requireAPIKeyScopes([APIKeyScopes.FACULTY_EDIT]), async (req: Request, res: Response) => {
    const {name, title, departments, imageURL} = req.body
    res.setHeader("Content-Type", "application/json")

    let faculty;
    try {
        faculty = await prisma.faculty.create({
            data: {
                name: name,
                title: title,
                departments: departments,
                imageURL: imageURL
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else if (e instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({error: "Unable to create faculty. Please check that all fields are valid."})
            return
        } else {
            res.status(500).json({error: "Unable to create faculty. " + e})
        }
    }
    res.status(201).json(faculty)
    return
}) 
.put("/:id", requireAPIKeyScopes([APIKeyScopes.FACULTY_EDIT]), async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const {name, title, departments, imageURL} = req.body
    res.setHeader("Content-Type", "application/json")
    if (isNaN(id)) {
        res.status(404).json({error: "Invalid faculty id."})
        return
    }

    let faculty;
    try {
        faculty = await prisma.faculty.update({
            where: {
                id: id
            },
            data: {
                name: name,
                title: title,
                departments: departments,
                imageURL: imageURL
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else if (e instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({error: "Unable to update faculty. Please check that all fields are valid."})
            return
        } else {
            res.status(500).json({error: "Unable to update faculty. " + e})
        }
    }
    res.status(200).json({faculty})
})

.delete("/:id", requireAPIKeyScopes([APIKeyScopes.FACULTY_EDIT]), async (req: Request, res: Response) => {
    const id: number = Number(req.params.id)
    res.setHeader("Content-Type", "application/json")
    if (isNaN(id)) {
        res.status(404).json({error: "Invalid faculty id."})
        return
    }
    let faculty;
    try {
        faculty = await prisma.faculty.delete({
            where: {
                id: id
            }
        })
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.meta != null) {
            res.status(400).json({error: e.meta})
            return
        } else {
            res.status(500).json({error: "Unable to delete faculty. " + e})
            return
        }
    }
    res.status(200).send(faculty)

})

export default router;
