import type { mealType } from "@prisma/client";

export type MenuItem = {
    station: string;
    name: string;
}


export type Meal = {
    menuItems: any;
    morningBreak?: MenuItem[];
    brunch?: MenuItem[];
    dinner?: MenuItem[];
    breakfast?: MenuItem[];
    lunch?: MenuItem[];
    lateNight?: MenuItem[];
}


export type DailyMenu = {
    sunday?: Meal;
    monday?: Meal;
    tuesday?: Meal;
    wednesday?: Meal;
    thursday?: Meal;
    friday?: Meal;
    saturday?: Meal;
}


export type WeeklyMenu = {
    date: string;
    menu: DailyMenu;
}

export type MealData = {
    name: string;
    type: { set: mealType[] };
    station: { set: station[] };
}
