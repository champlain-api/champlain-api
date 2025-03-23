import prisma from "../src/prisma_client"
import * as fs from 'fs';
import * as path from 'path';
import type {Faculty} from '../src/types/faculty.d.ts';

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
            direction: 20,
            lat: 44.4743,
            lon: -73.2067,
            mph: 20,
        }
    })

    const jsonFilePath = path.join(__dirname, '../src/data/faculty.json');
    const facultyJSON: Faculty[] = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    if (facultyJSON.length > 0) {
        await prisma.faculty.deleteMany({});
        let idCounter = 1;
        for (const faculty of facultyJSON) {
            const lowerCaseDepartments = faculty.departments.map((dept: string) => dept.toLowerCase());

            await prisma.faculty.upsert({
                where: {id: idCounter},
                update: {},
                create: {
                    name: faculty.name,
                    title: faculty.title,
                    departments: lowerCaseDepartments,
                    imageURL: faculty.imageUrl,
                    updated: new Date(Date.now())
                }
            });
            idCounter++;
        }

    }

    // Add example API key and user

    await prisma.user.create({
        data: {
            email: "tester@example.invalid",
            id: 1
        }
    })

    await prisma.apiKey.create({
        data: {
            key: "all-scopes",
            scopes: ["ANNOUNCEMENTS_EDIT", "FACULTY_EDIT", "SHUTTLE_EDIT"],
            userID: 1
        }
    })
    await prisma.apiKey.create({
        data: {
            key: "shuttle-edit",
            scopes: ["SHUTTLE_EDIT"],
            userID: 1
        }
    })

}

addSeedData()
