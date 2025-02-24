import express from "express";
import type { Response, Request } from "express";
import fs from "fs";
import type { Faculty } from "../types/faculty.d.ts"

const facultyJSON: Faculty[] = JSON.parse(fs.readFileSync("src/data/faculty.json", "utf8"));

const router = express.Router();

// Initialize an empty array for faculty data
let facultyData: Faculty[] = facultyJSON; // Populate the array

// Route to get all faculty data
router.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.json(facultyData);
 });
 
// Route to get a specific faculty member by name
router.get("/:name", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    const name = req.params.name.toLowerCase();
    const facultyMember = facultyData.find(faculty => faculty.name.toLowerCase() === name);

    if (facultyMember) {
        res.json(facultyMember);
    } else {
        res.status(404).json({ "error": "Faculty member not found." });
    }
});

// Route to get faculty members by department
router.get("/department/:departmentName", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");

    // Normalize the department name
    const departmentName = req.params.departmentName.trim().toLowerCase();

    const filteredFaculty = facultyData.filter(faculty =>
        // Ensure it's comparing case-insensitive and handling potential extra spaces
        faculty.departments.some(department => department.trim().toLowerCase() === departmentName)
    );

    if (filteredFaculty.length > 0) {
        res.json(filteredFaculty);
    } else {
        res.status(404).json({ "error": "No faculty members found for this department." });
    }
});

export default router;
