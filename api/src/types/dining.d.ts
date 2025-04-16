import type { mealType, station } from "@prisma/client";

export type Meal = {
  id?: number;
  name: string;
  station: station[];
  type: mealType[];
}

export type DailyMenu = {
  id?: number;
  dayofWeek: string;
  Meals: Meal[];
}

export type WeeklyMenu = {
  date?: string;
  dailyMenus: DailyMenu[];
}

export type MealData = {
  name: string;
  type: { set: mealType[] };
  station: { set: station[] };
}