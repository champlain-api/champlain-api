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
    })

    await prisma.apiKey.create({
        data: {
            key: "all-scopes",
            scopes: ["ANNOUNCEMENTS_EDIT", "FACULTY_EDIT", "SHUTTLE_EDIT", "HOUSING_EDIT", "BUILDING_EDIT"],
            userID: 1
        }
    })


}

addSeedData()