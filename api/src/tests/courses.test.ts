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

import { expect, test, describe, beforeAll } from "bun:test";
import request from "supertest"
import {app} from "../index.ts"
import type { Course } from "../types/courses.ts";

beforeAll(async () => {
    request(app)
})

describe("Courses API", () => {
    const mockCourse: Partial<Course[0]> = {
        id: expect.any(Number),
        title: expect.any(String),
        number: expect.any(String),
        credit: expect.any(Number),
        openseats: expect.any(Number),
        days: expect.any(String),
        times: expect.any(String),
        instructor_name: expect.any(String),
        description: expect.any(String),
        room: expect.any(String),
        subject: expect.any(String),
        type: expect.any(String),
        prereq: expect.any(String),
        start_date: expect.any(String),
        end_date: expect.any(String),
        semesterId: expect.any(Number),
    };

    describe("GET requests", () => {
        test("GET /courses should return a 200 and a list of courses", async () => {
            let req = await fetch("http://localhost:3000/courses");
            expect(req.status).toEqual(200);
            let responseBody = await req.json();
            expect(responseBody).toBeInstanceOf(Array);
            expect(responseBody.length).toBeGreaterThan(0);
            expect(responseBody[0]).toHaveProperty("courses");
            expect(responseBody[0].courses[0]).toMatchObject(mockCourse);
        });

        test("GET /courses/:id should return a 200 and a specific course", async () => {
            let req = await fetch("http://localhost:3000/courses/1");
            expect(req.status).toEqual(200);
            let responseBody = await req.json();
            expect(responseBody).toMatchObject(mockCourse);
        });

        test("GET /courses/:invalid-id should return a 400", async () => {
            let req = await fetch("http://localhost:3000/courses/invalid-id");
            expect(req.status).toEqual(400);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });

        test("GET /courses/:unknown-id should return a 404", async () => {
            let req = await fetch("http://localhost:3000/courses/9999");
            expect(req.status).toEqual(404);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("POST requests", () => {
        test("POST /courses with valid data should return a 201 and the new course", async () => {
            let req = await fetch("http://localhost:3000/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "New Course",
                    number: "COURSE-101",
                    credit: 3,
                    openseats: 10,
                    days: "MWF",
                    times: "10:00-11:00",
                    instructor_name: "John Doe",
                    description: "A new course description.",
                    room: "Room 101",
                    subject: "General",
                    type: "Lecture",
                    prereq: "None",
                    start_date: "2025-01-01",
                    end_date: "2025-05-01",
                    semesterId: 1,
                }),
            });
            expect(req.status).toEqual(201);
            let responseBody = await req.json();
            expect(responseBody).toMatchObject(mockCourse);
        });

        test("POST /courses with missing required fields should return a 400", async () => {
            let req = await fetch("http://localhost:3000/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Incomplete Course",
                    // Missing required fields like `number` and `semesterId`
                }),
            });
            expect(req.status).toEqual(400);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });

        test("POST /courses with invalid semesterId should return a 404", async () => {
            let req = await fetch("http://localhost:3000/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Invalid Semester Course",
                    number: "COURSE-102",
                    credit: 3,
                    openseats: 10,
                    days: "MWF",
                    times: "10:00-11:00",
                    instructor_name: "Jane Doe",
                    description: "A course with an invalid semester.",
                    room: "Room 102",
                    subject: "General",
                    type: "Lecture",
                    prereq: "None",
                    start_date: "2025-01-01",
                    end_date: "2025-05-01",
                    semesterId: 9999, // Invalid semesterId
                }),
            });
            expect(req.status).toEqual(404);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("PUT requests", () => {
        test("PUT /courses/:id with valid data should return a 200 and the updated course", async () => {
            let req = await fetch("http://localhost:3000/courses/1", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Updated Course Title",
                    description: "Updated course description.",
                }),
            });
            expect(req.status).toEqual(200);
            let responseBody = await req.json();
            expect(responseBody).toMatchObject({
                title: "Updated Course Title",
                description: "Updated course description.",
            });
        });

        test("PUT /courses/:id with invalid id should return a 400", async () => {
            let req = await fetch("http://localhost:3000/courses/invalid-id", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Updated Course Title",
                }),
            });
            expect(req.status).toEqual(400);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });

        test("PUT /courses/:unknown-id should return a 404", async () => {
            let req = await fetch("http://localhost:3000/courses/9999", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Updated Course Title",
                }),
            });
            expect(req.status).toEqual(404);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("DELETE requests", () => {
        test("DELETE /courses/:id should return a 200 and delete the course", async () => {
            let req = await fetch("http://localhost:3000/courses/1", {
                method: "DELETE",
            });
            expect(req.status).toEqual(200);
            expect(await req.json()).toMatchObject({ message: "Course deleted successfully." });
        });

        test("DELETE /courses/:invalid-id should return a 400", async () => {
            let req = await fetch("http://localhost:3000/courses/invalid-id", {
                method: "DELETE",
            });
            expect(req.status).toEqual(400);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });

        test("DELETE /courses/:unknown-id should return a 404", async () => {
            let req = await fetch("http://localhost:3000/courses/9999", {
                method: "DELETE",
            });
            expect(req.status).toEqual(404);
            expect(await req.json()).toMatchObject({ error: expect.any(String) });
        });
    });
});

describe("Semester API", () => {
    const mockSemester = {
        id: expect.any(Number),
        name: expect.any(String),
        year: expect.any(String),
        date: expect.any(String),
    };

    describe("GET requests", () => {
        test("GET /semester should return a 200 and a list of semesters", async () => {
            const response = await request(app).get("/semester").send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toMatchObject(mockSemester);
        });

        test("GET /semester/:id should return a 200 and a specific semester", async () => {
            const response = await request(app).get("/semester/1").send();
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(mockSemester);
        });

        test("GET /semester/:invalid-id should return a 400", async () => {
            const response = await request(app).get("/semester/invalid-id").send();
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });

        test("GET /semester/:unknown-id should return a 404", async () => {
            const response = await request(app).get("/semester/9999").send();
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("POST requests", () => {
        test("POST /semester with valid data should return a 201 and the new semester", async () => {
            const response = await request(app)
                .post("/semester")
                .send({
                    name: "Spring",
                    year: "2025",
                    date: "January 13th - May 2nd",
                });
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(mockSemester);
        });

        test("POST /semester with missing required fields should return a 400", async () => {
            const response = await request(app)
                .post("/semester")
                .send({
                    name: "Spring",
                    // Missing `year` and `date`
                });
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("PUT requests", () => {
        test("PUT /semester/:id with valid data should return a 200 and the updated semester", async () => {
            const response = await request(app)
                .put("/semester/1")
                .send({
                    name: "Updated Semester Name",
                    year: "2026",
                    date: "Updated Date Range",
                });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                name: "Updated Semester Name",
                year: "2026",
                date: "Updated Date Range",
            });
        });

        test("PUT /semester/:id with invalid id should return a 400", async () => {
            const response = await request(app)
                .put("/semester/invalid-id")
                .send({
                    name: "Updated Semester Name",
                });
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });

        test("PUT /semester/:unknown-id should return a 404", async () => {
            const response = await request(app)
                .put("/semester/9999")
                .send({
                    name: "Updated Semester Name",
                });
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("DELETE requests", () => {
        test("DELETE /semester/:id should return a 200 and delete the semester", async () => {
            const response = await request(app).delete("/semester/1").send();
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ message: "Semester deleted successfully." });
        });

        test("DELETE /semester/:invalid-id should return a 400", async () => {
            const response = await request(app).delete("/semester/invalid-id").send();
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });

        test("DELETE /semester/:unknown-id should return a 404", async () => {
            const response = await request(app).delete("/semester/9999").send();
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });
});
