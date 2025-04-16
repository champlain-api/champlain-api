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
import {expect, test, describe, beforeAll} from "bun:test";
import request from "supertest"
import {app} from "../index.ts"

beforeAll(async () => {
    request(app)
})

describe("/dining-menu-idx", () => {

    
    const mockMeal = {
        id: expect.any(Number),
        name: expect.any(String),
        station: expect.any(Array),
        type: expect.any(Array)
    };

    const mockDailyMenu = {
        id: expect.any(Number),
        dayofWeek: expect.any(String),
        Meals: expect.any(Array)
    };

    describe("GET requests", () => {

        test("GET / to return a 200", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx")

            expect(req.status).toEqual(200)
        });

        test("GET /:dayofWeek", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/Monday")

            expect(req.status).toEqual(200)
            const response = await req.json();
            expect(response).toBeDefined()
        });

        test("GET /:station/:dayofWeek", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/SIZZLE/Monday")

            expect(req.status).toEqual(200)
            const response = await req.json();
            // Expecting an array of meals
            expect(Array.isArray(response)).toBe(true)
        });

        test("GET /:station/:dayofWeek/:mealType", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/SIZZLE/Monday/BREAKFAST")

            expect(req.status).toEqual(200)
            const response = await req.json();
            // Expecting an array of meals
            expect(Array.isArray(response)).toBe(true)
        });

        test("GET /:invalid-station/:dayofWeek", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/INVALID_STATION/Monday")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    });

    describe("Authentication tests", () => {
        test("PUT /:id (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/1", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    Meals: []
                })
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE /:id (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/1", {
                method: "DELETE"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    });

    describe("CRUD operations with auth", () => {
        test("PUT /:id to create a new menu", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/999", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    Meals: [
                        {
                            name: "Test Meal",
                            station: ["SIZZLE"],
                            type: ["BREAKFAST"]
                        }
                    ]
                })
            })
            expect(req.status).toEqual(201)
            const response = await req.json();
            expect(response).toMatchObject({
                message: expect.stringContaining("created"),
                newMenu: expect.any(Object)
            })
        });

        test("PUT /:id to update existing menu", async () => {
            // Check to see if menu already exists
            let req = await fetch("http://localhost:3000/dining-menu-idx/999", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    Meals: [
                        {
                            name: "Updated Test Meal",
                            station: ["BAKERY"],
                            type: ["LUNCH"]
                        }
                    ]
                })
            })
            expect([200, 201]).toContain(req.status) // Could be 200 or 201 depending on if already exists
            const response = await req.json();
            expect(response).toMatchObject({
                message: expect.stringMatching(/updated|created/), 
            })
        });

        test("DELETE /:id to delete a menu", async () => {
            let req = await fetch("http://localhost:3000/dining-menu-idx/999", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                message: expect.stringContaining("deleted")
            })
        });
    });
});