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


    const rawData = fs.readFileSync("src/data/semesters_and_courses.json", "utf8");
    const semestersData = JSON.parse(rawData);

    for (const semesterData of semestersData) {
        // Create semester first
        const semester = await prisma.semester.create({
            data: {
                name: semesterData.name,
                year: semesterData.year,
                date: semesterData.date, // Storing as a string
            }
        });

        // Insert courses linked to this semester
        for (const courseData of semesterData.courses) {
            await prisma.course.create({
                data: {
                    title: courseData.title,
                    number: courseData.number,
                    credit: courseData.credit,
                    openseats: courseData.openseats,
                    days: courseData.days,
                    times: courseData.times,
                    instructor_name: courseData.instructor_name,
                    description: courseData.description,
                    room: courseData.room,
                    subject: courseData.subject,
                    type: courseData.type,
                    prereq: courseData.prereq,
                    start_date: courseData.start_date, // Keeping as string
                    end_date: courseData.end_date, // Keeping as string
                    semesterId: semester.id, // Linking course to semester
                }
            });
        }
    }
}

addSeedData()
