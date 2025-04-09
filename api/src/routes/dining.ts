import express, { type Request, type Response } from 'express';
import prisma from "../prisma_client.ts";
import {requireAPIKeyScopes} from "../middleware/api-middleware.ts";
import {Prisma, APIKeyScopes, station, mealType} from "@prisma/client";




const router = express.Router();
router.use(express.json());




// Fetch Daily Menus
router.get('/', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try{
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


router.get('/dayofWeek/:dayofWeek', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');


    const day = req.params.dayofWeek;
    try {
        const dailyMenus = await prisma.dailyMenu.findFirst({
            where: {
                dayofWeek: {
                    equals: day
                },
            },
            include: {
               Meals: true,
            }
        });


        res.json(dailyMenus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from database' });
    }
});


router.get('/:station/:dayofWeek', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');


    const stationParam = req.params.station?.toUpperCase();
    const dayOfWeekParam = req.params.dayofWeek;


    // Validate station parameter against enum values
    if (!stationParam || !Object.values(station).includes(stationParam as station)) {
         res.status(400).json({ error: `Invalid station provided` });
    }


    try {
        // Cast stationParam to the station enum type
        const stationEnum = stationParam as station;


        const mealsWithDayOfWeek = await prisma.meal.findMany({
            where: {
                station: {
                    has: stationEnum, // Filter by station
                },
                DailyMenu: {
                    some: {
                        dayofWeek: dayOfWeekParam,
                    },
                },
            },
        });


        res.json(mealsWithDayOfWeek);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from database' });
    }
});
router.get('/:station/:dayofWeek/:mealType', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');


    const stationParam = req.params.station?.toUpperCase();
    const dayOfWeekParam = req.params.dayofWeek;
    const mealTypeParam = req.params.mealType?.toUpperCase();


    // Validate station parameter against enum values
    if (!stationParam || !Object.values(station).includes(stationParam as station)) {
         res.status(400).json({ error: `Invalid station provided` });
    }


    try {
        // Cast stationParam to the station enum type
        const stationEnum = stationParam as station;
        const mealTypeEnum = mealTypeParam as mealType;


        const mealsWithDayOfWeek = await prisma.meal.findMany({
            where: {
                station: {
                    has: stationEnum, // Filter by station
                },
                DailyMenu: {
                    some: {
                        dayofWeek: dayOfWeekParam,
                    },
                },
                type: {
                    has: mealTypeEnum
                }
            },
           
        });


        res.json(mealsWithDayOfWeek);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from database' });
    }
});
   
// Update a DailyMenu
router.put('/:id', requireAPIKeyScopes([APIKeyScopes.DINING_EDIT]), async (req: Request, res: Response) => {
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
           
             res.status(201).json({ message: `Menu with ID ${id} created.`, newMenu });
        }
       
        const updatedMenu = await prisma.dailyMenu.update({
            where: { id: Number(id) },
            data: {
                Meals: Meals ? { deleteMany: {}, create: Meals } : undefined,
            },
        });
       
         res.json({ message: `Menu with ID ${id} updated.`, updatedMenu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to update or create DailyMenu.` });
    }
});


// Delete a DailyMenu
router.delete('/:id', requireAPIKeyScopes([APIKeyScopes.DINING_EDIT]), async (req: Request, res: Response) => {
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
