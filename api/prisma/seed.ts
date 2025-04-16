/*
   Copyright 2025 Champlain API Authors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

import prisma from "../src/prisma_client"
import { mealType, station} from "@prisma/client";
import { MealData } from "../src/types/dining";

async function addSeedData() {
    // Add example announcements
    await prisma.announcement.upsert({
        where: { id: 1 },
        update: {},
        create: {
            title: "Shuttle service suspended",
            description: "The shuttle service is suspended until further notice.",
            style: 'INFO',
            type: ["SHUTTLE"]
        }
    })
    await prisma.announcement.upsert({
        where: { id: 2 },
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
        where: { id: 1 },
        update: {},
        create: {
            direction: 20,
            lat: 44.4743,
            lon: -73.2067,
            mph: 20,
        }
    })

    await prisma.faculty.create({
        data: {
            name: "Dave Kopec",
            title: "Associate Professor, Co-Program Director of Computer Science",
            departments: ["csin", "its"],
            imageURL: "https://www.champlain.edu/app/uploads/2024/03/Kopec_David-800x800.jpg",
        }
    });

    await prisma.faculty.create({
        data: {
            name: "Ryan Gillen",
            title: "Leahy Center Manager",
            departments: ["leahy center"],
            imageURL: "https://www.champlain.edu/app/uploads/2024/05/Gillen_Ryan-400x400.jpg",
        }
    });

   
    await prisma.housing.create({
        data: {
            name: "South House",
            type: "Victorian-Era Mansion",
            students: 47,
            distance: "2 blocks",
            address: "363 S. Willard St, Burlington, VT 05401",
            imageURL: "https://www.champlain.edu/app/uploads/2023/08/South-House-2-800x450.jpg"
        }
    });

    await prisma.housing.create({
        data: {
            name: "Summit Hall",
            type: "Victorian-Era Mansion",
            students: 48,
            distance: "2 blocks",
            address: "322 Maple St, Burlington, VT 05401",
            imageURL: "https://www.champlain.edu/app/uploads/2023/08/Summit-Hall_res-hall-dorm-residence-2-800x450.jpg"
        }
    });

    await prisma.building.create({
        data: {
            name: "Miller Information Commons",
            location: "95 Summit Street, Burlington, Vermont 05401",
            hours: [
                { "day": "monday", "hours": "8 AM - 11 PM" },
                { "day": "tuesday", "hours": "8 AM - 11 PM" },
                { "day": "wednesday", "hours": "8 AM - 11 PM" },
                { "day": "thursday", "hours": "8 AM - 11 PM" },
                { "day": "friday", "hours": "8 AM - 12:00 AM" },
                { "day": "saturday", "hours": "12 PM - 12 AM" },
                { "day": "sunday", "hours": "10 AM - 12 AM" }
            ]
        }
    })
    async function createMealsForDay(dayMenu) {
        const meals: MealData[] = [];
     
        for (const [mealTypeKey, mealItems] of Object.entries(dayMenu)) {
          if (!Array.isArray(mealItems)) {
            console.warn(`Skipping ${mealTypeKey} because it is not an array or it is missing.`);
            continue;
          }
     
         
          const mealTypeEnum = mealType[mealTypeKey.toUpperCase().replace(' ', '_')] as mealType;
     
          // Iterate over each meal item for the current mealType
          for (const meal of mealItems) {
            let stationEnums: station[] = [];
     
            if (Array.isArray(meal.station)) {
              stationEnums = meal.station.map((stationName: string) => {
                const stationEnum = station[stationName.toUpperCase().replace(' ', '_')];
                if (!stationEnum) {
                  console.warn(`Invalid station: ${stationName}`);
                  return undefined; // If the station doesn't exist we return undefined
                }
                return stationEnum;
              }).filter((stationEnum) => stationEnum !== undefined);
            } else {
             
              const formattedStationName = meal.station.trim().toUpperCase().replace(/ /g, '_');
              const stationEnum = station[formattedStationName];
              if (!stationEnum) {
                console.warn(`Invalid station: ${meal.station}`);
              }
              stationEnums = stationEnum ? [stationEnum] : []; // If invalid we skip adding to the array
            }
     
            if (stationEnums.length > 0) {
             
              meals.push({
                name: meal.name,
                type: { set: [mealTypeEnum] },
                station: { set: stationEnums },
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
     
          // Loop through each day of the week
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
        
    // Add example API key and user

    await prisma.user.create({
        data: {
            email: "tester@example.invalid",
            id: 1
        }
    });

    await prisma.apiKey.create({
        data: {
            key: "all-scopes",
            scopes: ["ANNOUNCEMENTS_EDIT", "FACULTY_EDIT", "SHUTTLE_EDIT", "HOUSING_EDIT", "BUILDING_EDIT", "COMPETENCIES_EDIT", "DINING_EDIT"],
            userID: 1
        }
    });

   await prisma.competencies.create({
        data: {
            competency: "Analysis",
            description: "The ability to separate and organize complex topics or issues into their component parts, and through a systematic process, to identify and differentiate those components to gain an understanding of the topic or issue.",
            criteria: [ "Understand Purpose", "Select Appropriate Modes", "Consider Ethical Implication", "Examines Conclusion" ],
            information: "https://drive.google.com/file/d/1o702L4R3oIJ7-z479-u6bdgI-wWb_-zg/view"
        }
    });

    await prisma.competencies.create({
        data: {
            competency: "Collaboration",
            description: "The ability to work inclusively and productively with a group toward a collective outcome; the ability to create an environment where each perspective is considered for the cooperative purpose of making progress toward common goals.",
            criteria: [ "Cohesive Vision", "Role Identification", "Inclusive Atmosphere", "Coordination", "Accountability" ],
            information: "https://drive.google.com/file/d/11CSZel1qZQQ3fTSy-DOWP28c7aKjEMNK/view"
        }
    });


}
   
    addSeedData();




