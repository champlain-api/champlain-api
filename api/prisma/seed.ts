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

    // Example data for semesters and courses
    const semestersData = [
        {
            name: "spring",
            year: "2025",
            date: "January 13th - May 2nd",
            courses: [
                {
                    id: 277,
                    title: "CYBR Pol Analysis & Implement",
                    number: "CYBR 420-45",
                    credit: 3,
                    openseats: 6,
                    days: "Online",
                    times: "Online",
                    instructor_name: "Charles Kelliher",
                    description: "In order to function effectively, businesses need to have policies that guide them and their employees. Information security policies are essential to provide guidance to the operations teams who would be expected to ensure the policies and standards have been implemented. Policies are guided by business needs, regulations and laws. Students will learn the difference between policies, standards, guidelines and procedures. This knowledge will help even technical professionals understand the needs of the business to be able to make risk-based decisions that will help the business achieve its aims.",
                    room: "",
                    subject: "Cybersecurity",
                    type: "Accelerated",
                    prereq: "CYBR-335",
                    start_date: "2025-03-10T00:00:00",
                    end_date: "2025-04-25T00:00:00"
                },
                {
                    id: 414,
                    title: "The Writing Process",
                    number: "ENGL 100-40B",
                    credit: 3,
                    openseats: 5,
                    days: "Online",
                    times: "Online",
                    instructor_name: "Mark Wolzenburg",
                    description: "This course introduces students to the foundational concepts needed to communicate effectively in writing for academic study and professional development. Students will also learn to read critically to evaluate an author's message. Students will be introduced to rhetorical modes and their role in the development of written communication. Students will also learn how to use revision strategies to create written communication that meets its intended purpose for its intended audience.",
                    room: "",
                    subject: "English - CPS",
                    type: "Accelerated",
                    prereq: "",
                    start_date: "2025-01-13T00:00:00",
                    end_date: "2025-02-28T00:00:00"
                },
                {
                    id: 652,
                    title: "Small Group Communication",
                    number: "COM 230-01",
                    credit: 3,
                    openseats: 14,
                    days: "T",
                    times: "10:00AM-12:45PM",
                    instructor_name: "Alfred Mills",
                    description: "Students will learn the basic theories and concepts pertaining to the topic of group communication, and how to apply that knowledge practically in actual lived experience. In applying theory to practice, students will learn how to work effectively with, and participate in, small groups at school, at home, in social situations, and in the workplace. Specifically, they will study how to be successful leaders in small groups, manage meetings effectively, manage group conflicts, use small groups to address problems in the home and workplace, and how to recognize, analyze, and address problems in group dynamics.",
                    room: "JOYC 212",
                    subject: "Communication",
                    type: "Day/Evening",
                    prereq: "Must have completed one of the following: COM-100, COM-130, or 30 credits.",
                    start_date: "2025-01-13T00:00:00",
                    end_date: "2025-05-02T00:00:00"
                },
                {
                    id: 885,
                    title: "Navigating Information",
                    number: "COR 103-07",
                    credit: 3,
                    openseats: 1,
                    days: "MTH",
                    times: "11:30AM-12:45PM",
                    instructor_name: "Erik Kaarla",
                    description: "What makes an argument good or bad? What counts as evidence in our post-truth world? How can you understand and assess the truth value of a claim when you're not an expert? In this course you'll learn rhetorical strategies about how to examine arguments and types of evidence in different disciplines and fields of study. To help learn these strategies, you will do close readings of texts from a variety of disciplines in the liberal arts and sciences, popular culture, and social media.",
                    room: "CCM 424",
                    subject: "Core",
                    type: "Day/Evening",
                    prereq: "Take COR-104 concurrently.",
                    start_date: "2025-01-13T00:00:00",
                    end_date: "2025-05-02T00:00:00"
                }
            ]
        },
        {
            name: "fall",
            year: "2025",
            date: "August 25th - December 12th",
            courses: [
                {
                    id: 0,
                    title: "Intermediate Accounting I",
                    number: "ACCT 230-81",
                    credit: 3,
                    openseats: 20,
                    days: "Online",
                    times: "Online",
                    instructor_name: "Staff",
                    description: "In this first course of a two-part sequence focusing on financial reporting students will learn theory, concepts, principles and practices underlying preparation of external financial reports, particularly application of generally accepted accounting principles related to disclosure of current and noncurrent assets and principles of revenue recognition on the Balance sheet, Income Statement and Statement of Retained Earnings. Students will also consider broad issues like the environment of financial reporting, the role of financial reporting and the accounting standard-setting process.",
                    room: "",
                    subject: "Accounting - CCO",
                    type: "Online",
                    prereq: "ACCT-130",
                    start_date: "2025-09-01T00:00:00",
                    end_date: "2025-12-12T00:00:00"
                },
                {
                    id: 0,
                    title: "Enterprise Database Systems",
                    number: "CMIT 310-45",
                    credit: 3,
                    openseats: 20,
                    days: "Online",
                    times: "Online",
                    instructor_name: "Staff",
                    description: "Introduces organization and processing in enterprise Database Management Systems. The student will develop skills in database systems analysis, management and processing. The structure, components, and processing of enterprise Database Management Systems (DBMS) will be covered. The course is presented from the viewpoint of operating and maintaining an enterprise level database system as well as supporting its use. Hands-on assignments will involve construction of a cloud based database server.",
                    room: "",
                    subject: "Comp & Info Tech -CPS",
                    type: "Accelerated",
                    prereq: "CMIT-200",
                    start_date: "2025-10-27T00:00:00",
                    end_date: "2025-12-12T00:00:00"
                },
                {
                    id: 0,
                    title: "Sound Design/Interact.& Games",
                    number: "SON 350-51",
                    credit: 3,
                    openseats: 18,
                    days: "M",
                    times: "05:30PM-08:15PM",
                    instructor_name: "Maxwell Johnson",
                    description: "The course starts with a critical look at interactive sound history,examining its cultural impacts, and analyzing the underlying theory of creating immersive sound environments. Following this, the course will look at techniques and design principles specific to interactivity as students begin to learn the fundamentals of the core technology. These include sound editing software for creation and editing as well as game software. The course culminates with the creating of a complete interactive audio package.",
                    room: "GBTC 012",
                    subject: "Sonic Arts",
                    type: "Day/Evening",
                    prereq: "Complete SON-120",
                    start_date: "2025-08-25T00:00:00",
                    end_date: "2025-12-12T00:00:00"
                }
            ]
        }
    ];

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

addSeedData();
