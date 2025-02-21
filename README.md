# Champlain API

## Explanation:
Currently, there is no centralized API to access Champlain College’s data. A centralized API would provide easy access to this data. This enables developers and students to build solutions that improve campus experiences.


## Objectives: 
- Create a centralized API: This project should create a centralized API where information can be accessed. Public users, students, and faculty should be able to use the API.
- Offer a scalable solution: The API should be designed so that future integrations and endpoints can be easily added.

## Building the API
Prerequisite: A functioning Postgres database.
1. cd to the `api` folder
2. Install dependencies with `npm i`
3. Copy the `.env.example` to `.env` and make changes
4. Build with `npm run build`
5. Run Prisma migrations (`npx prisma migrate dev`)
6. Run using `npm run dev`
7. Visit http://localhost:3000/ in web browser.

## Building the documentation
1. Change directory to the `swagger` folder
2. Install dependencies with `npm i`
3. Build with `npm run build`
4. Preview with `npm run preview`
5. Visit http://localhost:4173/ in a web browser

The API files are generated in `/swagger/dist`