import prisma from "../src/prisma_client"
import * as fs from 'fs';
import * as path from 'path';
import { Faculty } from '../src/types/faculty';
import { Housing } from '../src/types/housing';

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
            console.log(`Inserting: ${faculty.name}, Departments:`, lowerCaseDepartments);
 
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

    const housingPath = path.join(__dirname, '../src/data/housingData.json');
    const housingJSON: Housing[] = JSON.parse(fs.readFileSync("src/data/housingData.json", "utf8"));

    if (housingJSON.length > 0) {
        await prisma.housing.deleteMany();
        let idCounter = 1;
        for(const housing of housingJSON) {
            console.log(`Inserting: ${housing.name}`);
            await prisma.housing.createMany({
                data: {
                    id: idCounter++,
                    name: housing.name,
                    type: housing.type,
                    students: housing.students,
                    distance: housing.distance,
                    address: housing.address,
                    imageURL: housing.imageUrl,
                    updated: new Date(Date.now())
                    }
            });
        }
    }

}
addSeedData()
