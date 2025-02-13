import express, { Response, Request } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Define the Faculty type
interface Faculty {
    name: string;
    title: string;
    departments: string[];
    imageUrl: string;
}

// Get the current directory of the module for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the correct path to the faculty JSON file (inside the data folder under src)
const facultyDataPath = path.resolve(__dirname, "../data", "faculty.json");

// Initialize an empty array for faculty data
let facultyData: Faculty[] = [];

// Load the data asynchronously when needed
async function loadFacultyData() {
  if (facultyData.length === 0) {
    const rawData = fs.readFileSync(facultyDataPath, "utf-8");
    facultyData = JSON.parse(rawData);
  }
}

// Route to get all faculty data
router.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    await loadFacultyData();
    res.json(facultyData);
 });
 
  


// Route to get a specific faculty member by name
router.get("/:name", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    await loadFacultyData();

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
    console.log("Requested department:", req.params.departmentName);  // Log department name from the URL
    res.setHeader("Content-Type", "application/json");
    await loadFacultyData();

    // Normalize the department name
    const departmentName = req.params.departmentName.trim().toLowerCase();
    console.log("Normalized department name:", departmentName); // Log normalized department name

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