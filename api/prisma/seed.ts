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

import { mealType, station } from "@prisma/client";
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

    // Sample meal data for each day of the week
    const sampleMenuData = {
        monday: {
            breakfast: [
                { name: "Scrambled Eggs", station: "GRILL" },
                { name: "Blueberry Pancakes", station: "GRILL" },
                { name: "Bacon", station: "GRILL" },
                { name: "Oatmeal", station: "CEREAL" },
                { name: "Fresh Fruit", station: "SALAD_BAR" }
            ],
            lunch: [
                { name: "Grilled Chicken Sandwich", station: "GRILL" },
                { name: "Vegetable Soup", station: "SOUP" },
                { name: "Caesar Salad", station: "SALAD_BAR" },
                { name: "Veggie Burger", station: "VEGAN" },
                { name: "French Fries", station: "GRILL" }
            ],
            dinner: [
                { name: "Roast Beef", station: "MAIN" },
                { name: "Mashed Potatoes", station: "MAIN" },
                { name: "Glazed Carrots", station: "MAIN" },
                { name: "Tofu Stir Fry", station: "VEGAN" },
                { name: "Cheesecake", station: "DESSERT" }
            ]
        },
        tuesday: {
            breakfast: [
                { name: "Breakfast Burrito", station: "GRILL" },
                { name: "Hash Browns", station: "GRILL" },
                { name: "Yogurt Parfait", station: "CEREAL" },
                { name: "Fresh Fruit", station: "SALAD_BAR" }
            ],
            lunch: [
                { name: "Turkey Club Sandwich", station: "DELI" },
                { name: "Tomato Bisque", station: "SOUP" },
                { name: "Garden Salad", station: "SALAD_BAR" },
                { name: "Falafel Wrap", station: "VEGAN" },
                { name: "Potato Chips", station: "DELI" }
            ],
            dinner: [
                { name: "Spaghetti and Meatballs", station: "MAIN" },
                { name: "Garlic Bread", station: "MAIN" },
                { name: "Steamed Broccoli", station: "MAIN" },
                { name: "Eggplant Parmesan", station: "VEGETARIAN" },
                { name: "Tiramisu", station: "DESSERT" }
            ]
        },

    };

    // Create meals and daily menus directly for Monday and Tuesday only
    try {
        // Create daily menu for Monday
        const mondayMenu = await prisma.dailyMenu.create({
            data: {
                dayofWeek: "Monday"
            }
        });
        
        console.log(`Daily menu for Monday created with ID: ${mondayMenu.id}`);
        
        // Monday breakfast meals
        await prisma.meal.create({
            data: {
                name: "Scrambled Eggs",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.ENTREE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Blueberry Pancakes",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.ENTREE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Bacon",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.ENTREE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Oatmeal",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.CEREAL] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Fresh Fruit",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.SALAD_BAR] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        // Monday lunch meals
        await prisma.meal.create({
            data: {
                name: "Grilled Chicken Sandwich",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.ENTREE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Vegetable Soup",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.SOUP] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Caesar Salad",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.SALAD_BAR] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Veggie Burger",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.VEGAN] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "French Fries",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.ENTREE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        // Monday dinner meals
        await prisma.meal.create({
            data: {
                name: "Roast Beef",
                type: { set: [mealType.DINNER] },
                station: { set: [station.SHOWCASE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Mashed Potatoes",
                type: { set: [mealType.DINNER] },
                station: { set: [station.SHOWCASE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Glazed Carrots",
                type: { set: [mealType.DINNER] },
                station: { set: [station.SHOWCASE] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Tofu Stir Fry",
                type: { set: [mealType.DINNER] },
                station: { set: [station.VEGAN] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Cheesecake",
                type: { set: [mealType.DINNER] },
                station: { set: [station.DESSERT] },
                DailyMenu: {
                    connect: { id: mondayMenu.id }
                }
            }
        });
        
        // Create daily menu for Tuesday
        const tuesdayMenu = await prisma.dailyMenu.create({
            data: {
                dayofWeek: "Tuesday"
            }
        });
        
        console.log(`Daily menu for Tuesday created with ID: ${tuesdayMenu.id}`);
        
        // Tuesday breakfast meals
        await prisma.meal.create({
            data: {
                name: "Breakfast Burrito",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.ENTREE] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Hash Browns",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.ENTREE] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Yogurt Parfait",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.CEREAL] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Fresh Fruit",
                type: { set: [mealType.BREAKFAST] },
                station: { set: [station.SALAD_BAR] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        // Tuesday lunch meals
        await prisma.meal.create({
            data: {
                name: "Turkey Club Sandwich",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.DELI] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Tomato Bisque",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.SOUP] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Garden Salad",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.SALAD_BAR] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Falafel Wrap",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.VEGAN] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Potato Chips",
                type: { set: [mealType.LUNCH] },
                station: { set: [station.DELI] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        // Tuesday dinner meals
        await prisma.meal.create({
            data: {
                name: "Spaghetti and Meatballs",
                type: { set: [mealType.DINNER] },
                station: { set: [station.SHOWCASE] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Garlic Bread",
                type: { set: [mealType.DINNER] },
                station: { set: [station.SHOWCASE] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Steamed Broccoli",
                type: { set: [mealType.DINNER] },
                station: { set: [station.SHOWCASE] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Eggplant Parmesan",
                type: { set: [mealType.DINNER] },
                station: { set: [station.VEGETARIAN] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        await prisma.meal.create({
            data: {
                name: "Tiramisu",
                type: { set: [mealType.DINNER] },
                station: { set: [station.DESSERT] },
                DailyMenu: {
                    connect: { id: tuesdayMenu.id }
                }
            }
        });
        
        console.log('Sample menu data for Monday and Tuesday has been successfully added to the database.');
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

addSeedData();

