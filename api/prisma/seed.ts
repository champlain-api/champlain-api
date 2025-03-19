import prisma from "../src/prisma_client"
import * as fs from 'fs';
import * as path from 'path';
import { Faculty } from '../src/types/faculty';

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
   

    
    await prisma.dailyMenu.upsert({
        where: { id: 1 },
        update: {},
        create: {
            dayofWeek: "Monday",
            Meals: {
                create: [
                    {
                        name: "Pancakes",
                        station: ["THE_BREAKFAST_BAR"],
                        type: ["BREAKFAST"],
                    },
                    {
                        name: "Black Bean Burger",
                        station: ["SIZZLE"],
                        type: ["LUNCH"],
                    },
                ],
            },
        },
    });

    await prisma.dailyMenu.upsert({
        where: { id: 2 },
        update: {},
        create: {
            dayofWeek: "Tuesday",
            Meals: {
                create: [
                    {
                        name: "Grilled Cheese",
                        station: ["SIZZLE"],
                        type: ["LUNCH", "DINNER"],
                    },
                    {
                        name: "Tomato Soup",
                        station: ["SOUP"],
                        type: ["LUNCH"],
                    },
                ],
            },
        },
    });



addSeedData()
}
