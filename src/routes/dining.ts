import express, { type Request, type Response } from 'express';
import type { WeeklyMenu, MenuItem, Meal, DailyMenu } from '../types/dining.js';

const router = express.Router();

let weeklyMenus: WeeklyMenu[] = [];

router.get('/', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');

    const diningMenuData = await fetch('https://search.champlain.edu/js/menu.js', {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!diningMenuData.ok) {
        res.status(diningMenuData.status).json({ error: `Failed to fetch data: ${diningMenuData.statusText}` });
        return;
    }

    const data = (await diningMenuData.json()) as WeeklyMenu[];
    weeklyMenus = data;  // Store the fetched data
    res.json(data);
});

router.post('/dining-menu', (req: Request, res: Response) => {
    const newMenu: WeeklyMenu = req.body;

    // Add validation if needed

    weeklyMenus.push(newMenu);
    res.status(201).json(newMenu);
});

router.get('/dining-menu/sort', (req: Request, res: Response) => {
    const { day, station } = req.query;

    let sortedMenu: WeeklyMenu[] = weeklyMenus;

    if (day) {
        sortedMenu = weeklyMenus.filter(menu => {
            const dailyMenu = menu.menu[day as keyof DailyMenu];
            return !!dailyMenu;
        });
    }

    if (station) {
        sortedMenu = sortedMenu.map(menu => {
            const filteredMenu: DailyMenu = {};
            Object.keys(menu.menu).forEach(dayKey => {
                filteredMenu[dayKey as keyof DailyMenu] = filterMealsByStation(menu.menu[dayKey as keyof DailyMenu], station as string);
            });
            return { ...menu, menu: filteredMenu };
        });
    }

    res.json(sortedMenu);
});

const filterMealsByStation = (meal: Meal | undefined, station: string): Meal | undefined => {
    if (!meal) return undefined;

    const filterItems = (items: MenuItem[] | undefined) => items?.filter(item => item.station === station);

    return {
        morningBreak: filterItems(meal.morningBreak),
        brunch: filterItems(meal.brunch),
        dinner: filterItems(meal.dinner),
        breakfast: filterItems(meal.breakfast),
        lunch: filterItems(meal.lunch),
        lateNight: filterItems(meal.lateNight),
    };
};

export default router;
