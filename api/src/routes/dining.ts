import express, { type Request, type Response } from 'express';
import prisma from "../prisma_client.ts";
import { mealType, station } from '@prisma/client';

const router = express.Router();
router.use(express.json());

// Fetch Daily Menus
router.get('/', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    
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

router.get('/:dayofWeek', async(req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const dailyMenus = await prisma.dailyMenu.findFirst({
            include: {
                Meals: true
            }
        });

        res.json(dailyMenus);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'failed to fetch data from database' }); 
    }
});
    
// Update a DailyMenu
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { Meals } = req.body;
    
    try {
        const existingMenu = await prisma.dailyMenu.findUnique({
            where: { id: Number(id) },
        });
        
        if (!existingMenu) {
            console.log(`Menu with ID ${id} doesn't exist. Creating a new one...`);
            
            const newMenu = await prisma.dailyMenu.create({
                data: {
                    id: Number(id),
                    Meals: {
                        create: Meals || [],
                    },
                },
            });
            
            return res.status(201).json({ message: `Menu with ID ${id} created.`, newMenu });
        }
        
        const updatedMenu = await prisma.dailyMenu.update({
            where: { id: Number(id) },
            data: {
                Meals: Meals ? { deleteMany: {}, create: Meals } : undefined,
            },
        });
        
        return res.json({ message: `Menu with ID ${id} updated.`, updatedMenu });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: `Failed to update or create DailyMenu.` });
    }
});

// Delete a DailyMenu - REMOVED DUPLICATE
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

export default router;