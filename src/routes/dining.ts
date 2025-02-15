import express, { type Request, type Response } from 'express'
import type { WeeklyMenu } from "../types/dining.js"
const router = express.Router()

let weeklyMenus: WeeklyMenu[] = [];

router
.get("/", async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    
    const diningMenuData = await fetch("https://search.champlain.edu/js/menu.js", {
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (!diningMenuData.ok) {
        res.status(diningMenuData.status).json({ error: `Failed to fetch data: ${diningMenuData.statusText}` })
        return
    }

    const data = await diningMenuData.json()
    res.json(data)
    router.post('/dining-menu', (req: Request, res: Response) => {
        const newMenu: WeeklyMenu = req.body;
      
        // Add validation if needed
      
        weeklyMenus.push(newMenu);
        res.status(201).json(newMenu);
      });
} )
export default router;