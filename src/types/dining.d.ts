

export type MenuItem = {
    station: string;
    name: string;
}

export type Meal = {
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