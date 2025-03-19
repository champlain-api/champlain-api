import express, { type Request, type Response } from 'express';
import prisma from "../prisma_client.ts";
import type { WeeklyMenu, MenuItem, Meal, DailyMenu } from '../types/dining.js';
import { mealType } from '@prisma/client';


const router = express.Router();


// Fetch Daily Menus
router.get('/', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');




    //I took the type filter code block from the announcments endpoint
    const typeFilter = req.query["type"] || [mealType.BREAKFAST, mealType.BRUNCH, mealType.DINNER, mealType.LATE_NIGHT, mealType.LUNCH, mealType.MORNING_BREAK]
    if (!(typeFilter instanceof Array)) {
                res.status(400).json({error: "'type' property is not an array."})
                return
            }
            // Now check if the array contains those only of mealType
            const hasValidTypes = typeFilter.every(el => Object.values(mealType).includes(el as mealType))
            if (!hasValidTypes) {
                res.status(400).json({error: "'type' property contains invalid values."})
                return
            }
    try {
        const dailyMenus = await prisma.dailyMenu.findMany({
            include: {
                     Meals: true
            }
        });


        res.json(dailyMenus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to fetch data from database` });
    }
});




export default router;
