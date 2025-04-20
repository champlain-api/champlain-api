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
import * as fs from 'fs';
import * as path from 'path';

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
            scopes: ["ANNOUNCEMENTS_EDIT", "FACULTY_EDIT", "SHUTTLE_EDIT", "HOUSING_EDIT", "BUILDING_EDIT", "COMPETENCIES_EDIT", ],
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


    // Create the first semester
    const springSemester = await prisma.semester.create({
        data: {
            name: "spring",
            year: "2025",
            date: "January 13th - May 2nd",
        },
    });

    // Add courses for the spring semester
    await prisma.course.create({
        data: {
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
            start_date: new Date("2025-03-10T00:00:00"),
            end_date: new Date("2025-04-25T00:00:00"),
            semesterId: springSemester.id, // Link to the spring semester
        },
    });

    await prisma.course.create({
        data: {
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
            start_date: new Date("2025-01-13T00:00:00"),
            end_date: new Date("2025-02-28T00:00:00"),
            semesterId: springSemester.id, // Link to the spring semester
        },
    });

    // Create the second semester
    const fallSemester = await prisma.semester.create({
        data: {
            name: "fall",
            year: "2025",
            date: "August 25th - December 12th",
        },
    });

    // Add courses for the fall semester
    await prisma.course.create({
        data: {
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
            start_date: new Date("2025-09-01T00:00:00"),
            end_date: new Date("2025-12-12T00:00:00"),
            semesterId: fallSemester.id, // Link to the fall semester
        },
    });

    await prisma.course.create({
        data: {
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
            start_date: new Date("2025-10-27T00:00:00"),
            end_date: new Date("2025-12-12T00:00:00"),
            semesterId: fallSemester.id, // Link to the fall semester
        },
    });
}

// ADD example clubs
await prisma.club.create({
    data: {
      name: "Anime Club",
      type: "Art & Entertainment",
      semester: "Fall SemesterSpring Semester",
      primaryContact: "Ryan George",
      email: "animeclub@champlain.edu",
      description: "Join the Anime Club to discuss and watch anime that students have voted on. Each week students put in their suggestions that correspond to a theme that members decide on each month. Other activities include trivia, karaoke, a jukebox, discussion on manga, and anime tier lists! Join us in our exploration of the Japanese animation and manga industry!",
      officers: {
        create: [
          {
            name: "Ryan George",
            title: "President"
          },
          {
            name: "Jason Braccia",
            title: "Vice President"
          },
          {
            name: "Felipe Lega",
            title: "Faculty Advisor"
          }
        ]
      }
    }
  });
  
  await prisma.club.create({
    data: {
      name: "Asian Student Association",
      type: "Diversity & InclusionSocial",
      semester: "Fall SemesterSpring Semester",
      primaryContact: "Caroline Waddington",
      email: "caroline.waddington@mymail.champlain.edu",
      description: "The Asian Student Association was created to make a safe space and learning environment for people who identify as Asian and/or want to learn more about and engage in Asian culture. Our main events are centered around food and movies for members to expand their taste in Asian food and media.",
      officers: {
        create: [
          {
            name: "Caroline Waddington",
            title: "President"
          },
          {
            name: "Jonathan Banfill",
            title: "Faculty Advisor"
          }
        ]
      }
    }
  });
  

addSeedData()
