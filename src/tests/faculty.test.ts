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
import type {Faculty} from "../types/faculty.d.ts";

beforeAll(async () => {
    request(app)
})


describe("/faculty", () => {

    const mockFaculty: Faculty = {
        id: expect.any(Number),
        name: expect.any(String),
        title: expect.any(String),
        departments: expect.any(Array),
        imageURL: expect.any(String),
        updated: expect.any(String),
    }


    describe("GET requests", () => {

        test("GET / to return a 200", async () => {
            let req = await fetch("http://localhost:3000/faculty")

            expect(req.status).toEqual(200)
        });

        test("GET /:id", async () => {
            let req = await fetch("http://localhost:3000/faculty/1")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                id: 1,
                name: expect.any(String),
                title: expect.any(String),
                departments: expect.any(Array),
                imageURL: expect.any(String),
                updated: expect.any(String),
            })
        })

        test("GET /:invalid-id", async () => {
            let req = await fetch("http://localhost:3000/faculty/2s")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})

        })

        test("GET /:unknown-id to return an 404", async () => {
            let req = await fetch("http://localhost:3000/faculty/100")

            expect(req.status).toEqual(404)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("GET /name/:name)", async () => {
            let req = await fetch("http://localhost:3000/faculty/name/Dave%20Kopec")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject(mockFaculty)

        })

        test("GET /department/:department)", async () => {
            let req = await fetch("http://localhost:3000/faculty/department/CSIN")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject([mockFaculty])

        })


    })

    describe("Invalid Authorization header", () => {
        // No Authorization header
        test("POST / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty", {
                method: "POST"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("PUT / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty/162499", {
                method: "PUT"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty/162499", {
                method: "DELETE"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        // Sent with header, but invalid key
        test("POST / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty", {
                method: "POST",
                headers: {
                    "Authorization": "",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("PUT / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty/2", {
                method: "PUT",
                headers: {
                    "Authorization": "",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty/15", {
                method: "DELETE",
                headers: {
                    "Authorization": "",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / (header + method, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("PUT / (header + method, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty/1", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE / (header + method, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/faculty/12", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

    })


    describe("Invalid body data", () => {
        test("POST / invalid name", async () => {
            let req = await fetch("http://localhost:3000/faculty", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: 1110,
                    title: "Faculty 1 title",
                    departments: ["its"]
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid title", async () => {
            let req = await fetch("http://localhost:3000/faculty", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Prof. Ian",
                    title: 20,
                    departments: ["its"]
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid department", async () => {
            let req = await fetch("http://localhost:3000/faculty", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Prof. Ian",
                    title: "Professor",
                    departments: 20
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    })


    describe("Valid Authorization header + key", () => {
        test("POST / to return an 201", async () => {
            let req = await fetch("http://localhost:3000/faculty", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Prof. Ian",
                    title: "Professor",
                    departments: ["its"]
                })
            })
            let jsonResponse = await req.json() as Faculty
            expect(req.status).toEqual(201)
            expect(jsonResponse).toMatchObject(mockFaculty)
        });

        test("PUT / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/faculty/2", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "New name",
                    title: "New title",
                    departments: ["new-department"]
                })
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                faculty: {
                    name: "New name",
                    title: "New title",
                    departments: ["new-department"]
                }

            })
        });

        test("DELETE / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/faculty/2", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                name: "New name",
                title: "New title",
                departments: ["new-department"]

            })
        });

        test("GET deleted faculty and return a 404", async () => {
            let req = await fetch("http://localhost:3000/faculty/2", {
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


