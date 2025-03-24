import express, { type Request, type Response } from 'express';
import prisma from "../prisma_client.ts";
import type { WeeklyMenu, MenuItem, Meal, DailyMenu } from '../types/dining.js';
import { mealType, station } from '@prisma/client';


const router = express.Router();


// Fetch Daily Menus
router.get('/', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');


    const stationFilter = req.query["station"] || [station.SLICES, station.BAKERY, station.RISE, station.RUSTIC_ROOTS, station.SALAD_BAR, station.SAVORY, station.SHOWCASE, station.SIZZLE, station.SOUP, station.THE_BREAKFAST_BAR, station.VEGETABLE]
    if (!(stationFilter instanceof Array)) {
                res.status(400).json({error: "'station' property is not an array."})
                return
            }
            const hasValidStations = stationFilter.every(el => Object.values(station).includes(el as station))
            if (!hasValidStations) {
                res.status(400).json({error: "'station' property contains invalid values."})
                return
            }

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
// Update a DailyMenu
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { date, Meals } = req.body; // Include any other fields you want to update

    try {
        const updatedMenu = await prisma.dailyMenu.update({
            where: { id: Number(id) },
            data: {
                Meals: Meals ? { set: Meals } : undefined,
            },
        });

        res.json(updatedMenu);
    } catch (error) {
        console.error(error);
            res.status(500).json({ error: `Failed to update DailyMenu.` });
    }

    // Delete a DailyMenu
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.dailyMenu.delete({
            where: { id: Number(id) },
        });

        res.json({ message: `DailyMenu with ID ${id} successfully deleted.` });
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ error: `Failed to delete DailyMenu.` });
    }
});

});




export default router;
