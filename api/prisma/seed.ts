import prisma from "../src/prisma_client"
import * as fs from 'fs';
import * as path from 'path';
import { Faculty } from '../src/types/faculty';
import { mealType, station} from "@prisma/client";
import { MealData } from "../src/types/dining";


async function addSeedData() {
    // Add example announcements
    await prisma.announcement.upsert({
        where: {id: 1},
        update: {},
        create: {
            title: "Shuttle service suspended",
            description: "The shuttle service is suspended until further notice.",
            style: 'INFO',
            type: ["SHUTTLE"]
        }
    })
    await prisma.announcement.upsert({
        where: {id: 2},
        update: {},
        create: {
            title: "Campus Closure",
            description: "The campus is closed until further notice due to the impending snow storms. Please be safe and stay off the roads!",
            style: 'EMERGENCY',
            type: ["WEB", "MOBILE"]
        }
    })

    // Add example shuttle.
    await prisma.shuttle.upsert({
        where: {id: 1},
        update: {},
        create: {
            direction: 0,
            lat: 44.47394871475691,
            lon: -73.20577978477449,
            mph: 20,
            updated: new Date(Date.now())
        }
    })

    const jsonFilePath = path.join(__dirname, '../src/data/faculty.json');
    const facultyJSON: Faculty[] = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
 
    if(facultyJSON.length > 0) {
        await prisma.faculty.deleteMany({});
        let idCounter = 1;
        for(const faculty of facultyJSON) {
            const lowerCaseDepartments = faculty.departments.map((dept: string) => dept.toLowerCase());
 
            await prisma.faculty.create({
                data: {
                    id: idCounter++,
                    name: faculty.name,
                    title: faculty.title,
                    departments: lowerCaseDepartments,
                    imageURL: faculty.imageUrl,
                    updated: new Date(Date.now())
                    }
            });
        }

    }
       
    async function createMealsForDay(dayMenu) {
      const meals: MealData[] = [];
    
      for (const [mealTypeKey, mealItems] of Object.entries(dayMenu)) {
        // Ensure mealItems is an array, otherwise skip it
        if (!Array.isArray(mealItems)) {
          console.warn(`Skipping ${mealTypeKey} because it is not an array or it is missing.`);
          continue;
        }
    
        // Map the mealType string to the Prisma enum value
        const mealTypeEnum = mealType[mealTypeKey.toUpperCase().replace(' ', '_')] as mealType;
    
        // Iterate over each meal item for the current mealType (e.g., breakfast, lunch, dinner)
        for (const meal of mealItems) {
          let stationEnums: station[] = [];
    
          // Check if meal.station is an array, and map to station enums accordingly
          if (Array.isArray(meal.station)) {
            stationEnums = meal.station.map((stationName: string) => {
              // Check if stationName exists in the Prisma enum
              const stationEnum = station[stationName.toUpperCase().replace(' ', '_')];
              if (!stationEnum) {
                console.warn(`Invalid station: ${stationName}`);
                return undefined; // If the station doesn't exist, return undefined
              }
              return stationEnum;
            }).filter((stationEnum) => stationEnum !== undefined); // Filter out undefined values
          } else {
            // If meal.station is a string, convert it to an array and map the value to a Prisma enum value
            const formattedStationName = meal.station.trim().toUpperCase().replace(/ /g, '_'); // Format and replace spaces
            const stationEnum = station[formattedStationName];
            if (!stationEnum) {
              console.warn(`Invalid station: ${meal.station}`);
            }
            stationEnums = stationEnum ? [stationEnum] : []; // If invalid, skip adding to the array
          }
    
          if (stationEnums.length > 0) {
            // Push the meal data into the `meals` array
            meals.push({
              name: meal.name,
              type: { set: [mealTypeEnum] }, // Prisma expects mealType as an array
              station: { set: stationEnums }, // Prisma expects station as an array
            });
          } else {
            console.warn(`Skipping meal '${meal.name}' due to invalid stations.`);
          }
        }
      }
    
      return meals;
    }
    
    async function fetchMenuData() {
      try {
        const response = await fetch('https://search.champlain.edu/js/menu.js');
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
    
        const data = await response.json();
        return data; 
      } catch (error) {
        console.error('Error fetching menu data:', error);
        throw error;
      }
    }
    
      try {
        const menuData = await fetchMenuData();
        const { date, menu } = menuData;
    
        // Loop through each day of the week (e.g., Sunday, Monday, etc.)
        for (const [day, meals] of Object.entries(menu)) {
          // Create a DailyMenu record for each day of the week
          const dailyMenu = await prisma.dailyMenu.create({
            data: {
              dayofWeek: day.charAt(0).toUpperCase() + day.slice(1), 
              Meals: {
                create: await createMealsForDay(meals),
              },
            },
          });
    
          console.log(`Daily menu for ${day} created with ID: ${dailyMenu.id}`);
        }
    
        console.log('Menu data has been successfully added to the database.');
      } catch (error) {
        console.error('Error adding seed data:', error);
      }
}
    
    addSeedData();
    