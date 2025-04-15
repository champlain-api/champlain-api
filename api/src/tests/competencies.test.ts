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
import type {Competencies} from "../types/competencies.d.ts";

beforeAll(async () => {
    request(app)
})


describe("/Competencies", () => {

    const mockCompetencies: Competencies = {
        id: expect.any(Number),
        competency: expect.any(String),
        description: expect.any(String),
        criteria: expect.any(Array),
        information: expect.any(String),
        updated: expect.any(String),
    }


    describe("GET requests", () => {

        test("GET / to return a 200", async () => {
            let req = await fetch("http://localhost:3000/competencies")

            expect(req.status).toEqual(200)
        });

        test("GET /:id", async () => {
            let req = await fetch("http://localhost:3000/competencies/1")

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
            let req = await fetch("http://localhost:3000/competencies/2s")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})

        })

        test("GET /:unknown-id to return an 404", async () => {
            let req = await fetch("http://localhost:3000/competencies/100")

            expect(req.status).toEqual(404)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("GET /name/:name)", async () => {
            let req = await fetch("http://localhost:3000/competencies/name/Dave%20Kopec")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject(mockCompetencies)

        })

        test("GET /department/:department)", async () => {
            let req = await fetch("http://localhost:3000/competencies/department/CSIN")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject([mockCompetencies])

        })


    })

    describe("Invalid Authorization header", () => {
        // No Authorization header
        test("POST / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/competencies", {
                method: "POST"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("PUT / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/competencies/162499", {
                method: "PUT"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/competencies/162499", {
                method: "DELETE"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        // Sent with header, but invalid key
        test("POST / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/competencies", {
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
            let req = await fetch("http://localhost:3000/competencies/2", {
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
            let req = await fetch("http://localhost:3000/competencies/15", {
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
            let req = await fetch("http://localhost:3000/competencies", {
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
            let req = await fetch("http://localhost:3000/competencies/1", {
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
            let req = await fetch("http://localhost:3000/competencies/12", {
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
            let req = await fetch("http://localhost:3000/competencies", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    competency: 1110,
                    description: "competencies 1 description",
                    criteria: ["look at it"],
                    information: "info.pdf",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid description", async () => {
            let req = await fetch("http://localhost:3000/competencies", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    competency: "competency 1",
                    description: 1,
                    criteria: ["look at it"],
                    information: "info.pdf",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid criteria", async () => {
            let req = await fetch("http://localhost:3000/competencies", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    competency: "Competency 1",
                    description: "competency 1 description",
                    criteria: 1,
                    information: "info.pdf",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid information", async () => {
            let req = await fetch("http://localhost:3000/competencies", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    competency: "Competency 1",
                    description: "competency 1 description",
                    criteria: ["Look at it"],
                    information: 1,
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    })


    describe("Valid Authorization header + key", () => {
        test("POST / to return an 201", async () => {
            let req = await fetch("http://localhost:3000/competencies", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    competency: "Competency 1",
                    description: "competency 1 description",
                    criteria: ["Look at it"],
                    information: ["info.pdf"],
                })
            })
            let jsonResponse = await req.json() as Competencies
            expect(req.status).toEqual(201)
            expect(jsonResponse).toMatchObject(mockCompetencies)
        });

        test("PUT / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/competencies/2", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    competency: " new Competency",
                    description: " new competency description",
                    criteria: ["new"],
                    information: ["new.pdf"]
                })
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                competencies: {
                    competency: " new Competency",
                    description: " new competency description",
                    criteria: ["new"],
                    information: ["new.pdf"]
                }
            })
        });

        test("DELETE / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/competencies/2", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                competency: " new Competency",
                description: " new competency description",
                criteria: ["new"],
                information: ["new.pdf"]

            })
        });

        test("GET deleted competencies and return a 404", async () => {
            let req = await fetch("http://localhost:3000/competencies/2", {
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