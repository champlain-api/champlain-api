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
