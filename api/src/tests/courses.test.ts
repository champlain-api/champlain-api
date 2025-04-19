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
import request from "supertest";
import { app } from "../index.ts";
import type { Course } from "../types/courses.ts";

beforeAll(async () => {
    request(app);
});

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
            const response = await request(app).get("/courses").send();
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toMatchObject(mockCourse);
        });

        test("GET /courses/:id should return a 200 and a specific course", async () => {
            const response = await request(app).get("/courses/1").send();
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(mockCourse);
        });

        test("GET /courses/:invalid-id should return a 400", async () => {
            const response = await request(app).get("/courses/invalid-id").send();
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });

        test("GET /courses/:unknown-id should return a 404", async () => {
            const response = await request(app).get("/courses/9999").send();
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("POST requests", () => {
        test("POST /courses with valid data should return a 200 and the new course", async () => {
            const response = await request(app)
                .post("/courses")
                .send({
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
                });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(mockCourse);
        });

        test("POST /courses with missing required fields should return a 400", async () => {
            const response = await request(app)
                .post("/courses")
                .send({
                    title: "Incomplete Course",
                    // Missing required fields like `number` and `semesterId`
                });
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });

        test("POST /courses with invalid semesterId should return a 404", async () => {
            const response = await request(app)
                .post("/courses")
                .send({
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
                });
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("PUT requests", () => {
        test("PUT /courses/:id with valid data should return a 200 and the updated course", async () => {
            const response = await request(app)
                .put("/courses/1")
                .send({
                    title: "Updated Course Title",
                    description: "Updated course description.",
                });
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                title: "Updated Course Title",
                description: "Updated course description.",
            });
        });

        test("PUT /courses/:id with invalid id should return a 400", async () => {
            const response = await request(app)
                .put("/courses/invalid-id")
                .send({
                    title: "Updated Course Title",
                });
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });

        test("PUT /courses/:unknown-id should return a 404", async () => {
            const response = await request(app)
                .put("/courses/9999")
                .send({
                    title: "Updated Course Title",
                });
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });

    describe("DELETE requests", () => {
        test("DELETE /courses/:id should return a 200 and delete the course", async () => {
            const response = await request(app).delete("/courses/1").send();
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({ message: "Course deleted successfully." });
        });

        test("DELETE /courses/:invalid-id should return a 400", async () => {
            const response = await request(app).delete("/courses/invalid-id").send();
            expect(response.status).toBe(400);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });

        test("DELETE /courses/:unknown-id should return a 404", async () => {
            const response = await request(app).delete("/courses/9999").send();
            expect(response.status).toBe(404);
            expect(response.body).toMatchObject({ error: expect.any(String) });
        });
    });
});
