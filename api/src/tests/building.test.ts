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
import { app } from "../index.ts"
import type { Building } from "../types/building.d.ts";

beforeAll(async () => {
    request(app)
})


describe("/building", () => {

    const testBuilding: Building = {
        id: expect.any(Number),
        name: expect.any(String),
        location: expect.any(String),
        hours: expect.any(Array)
    }


    describe("GET requests", () => {

        test("GET / to return a 200", async () => {
            let req = await fetch("http://localhost:3000/building")

            expect(req.status).toEqual(200)
        });

        test("GET /:id", async () => {
            let req = await fetch("http://localhost:3000/building/1")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                id: 1,
                name: "Miller Information Commons",
                location: expect.any(String),
                hours: expect.any(Array)
            })
        })

        test("GET /:invalid-id", async () => {
            let req = await fetch("http://localhost:3000/building/2s")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })

        })

        test("GET /:unknown-id to return an 404", async () => {
            let req = await fetch("http://localhost:3000/building/100")

            expect(req.status).toEqual(404)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });
    })

    describe("Invalid Authorization header", () => {
        // No Authorization header
        test("POST / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building", {
                method: "POST"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("PUT / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building/162499", {
                method: "PUT"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("DELETE / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building/162499", {
                method: "DELETE"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        // Sent with header, but invalid key
        test("POST / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building", {
                method: "POST",
                headers: {
                    "Authorization": "",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("PUT / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building/2", {
                method: "PUT",
                headers: {
                    "Authorization": "",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("DELETE / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building/15", {
                method: "DELETE",
                headers: {
                    "Authorization": "",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("POST / (header + method, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("PUT / (header + method, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building/1", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("DELETE / (header + method, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/building/12", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

    })


    describe("Invalid body data", () => {
        test("POST / invalid name", async () => {
            let req = await fetch("http://localhost:3000/building", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Miller Information Common",
                    location: 20,
                    hours: [{ "day": "monday", "hours": "24/7" }, { "day": "tuesday", "hours": "24/7" }, { "day": "wednesday", "hours": "24/7" }, { "day": "thursday", "hours": "24/7" }, { "day": "friday", "hours": "24/7" }, { "day": "saturday", "hours": "24/7" }, { "day": "sunday", "hours": "24/7" }]
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });

        test("POST / invalid title", async () => {
            let req = await fetch("http://localhost:3000/building", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: 20,
                    location: 20,
                    hours: [{ "day": "monday", "hours": "24/7" }, { "day": "tuesday", "hours": "24/7" }, { "day": "wednesday", "hours": "24/7" }, { "day": "thursday", "hours": "24/7" }, { "day": "friday", "hours": "24/7" }, { "day": "saturday", "hours": "24/7" }, { "day": "sunday", "hours": "24/7" }]
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({ error: expect.any(String) })
        });
    })


    describe("Valid Authorization header + key", () => {
        test("POST / to return an 201", async () => {
            let req = await fetch("http://localhost:3000/building", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Joyce Hall",
                    location: "Campus",
                    hours: [
                        { "day": "monday", "hours": "24/7" }, { "day": "tuesday", "hours": "24/7" }, { "day": "wednesday", "hours": "24/7" }, { "day": "thursday", "hours": "24/7" }, { "day": "friday", "hours": "24/7" }, { "day": "saturday", "hours": "24/7" }, { "day": "sunday", "hours": "24/7" }
                    ]
                })
            })
            let jsonResponse = await req.json() as Building
            expect(req.status).toEqual(201)
            expect(jsonResponse).toMatchObject(testBuilding)
        });

        test("PUT / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/building/2", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Joyce Hall",
                    location: "Campus",
                    hours: [
                        { "day": "monday", "hours": "24/7" }, { "day": "tuesday", "hours": "24/7" }, { "day": "wednesday", "hours": "24/7" }, { "day": "thursday", "hours": "24/7" }, { "day": "friday", "hours": "24/7" }, { "day": "saturday", "hours": "24/7" }, { "day": "sunday", "hours": "24/7" }
                    ]
                })
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                    id: 2,
                    name: "Joyce Hall",
                    location: "Campus",
                    hours: [
                        { "day": "monday", "hours": "24/7" },
                        { "day": "tuesday", "hours": "24/7" },
                        { "day": "wednesday", "hours": "24/7" },
                        { "day": "thursday", "hours": "24/7" },
                        { "day": "friday", "hours": "24/7" },
                        { "day": "saturday", "hours": "24/7" },
                        { "day": "sunday", "hours": "24/7" }
                    ]
            })
        });

        test("DELETE / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/building/2", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                name: "Joyce Hall",
                location: "Campus",
                hours: [
                    { "day": "monday", "hours": "24/7" },
                    { "day": "tuesday", "hours": "24/7" },
                    { "day": "wednesday", "hours": "24/7" },
                    { "day": "thursday", "hours": "24/7" },
                    { "day": "friday", "hours": "24/7" },
                    { "day": "saturday", "hours": "24/7" },
                    { "day": "sunday", "hours": "24/7" }
                ]

            })
        });

        test("GET a deleted building and return a 404", async () => {
            let req = await fetch("http://localhost:3000/building/2", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(404)
        });

    })

});


