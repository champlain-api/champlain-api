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
import type {Housing} from "../types/housing.d.ts";

beforeAll(async () => {
    request(app)
})


describe("/housing", () => {

    const mockHousing: Housing = {
        id: expect.any(Number),
        name: expect.any(String),
        type: expect.any(String),
        students: expect.any(String),
        distance: expect.any(String),
        address: expect.any(String),
        imageURL: expect.any(String),
        updated: expect.any(String),
    }


    describe("GET requests", () => {

        test("GET / to return a 200", async () => {
            let req = await fetch("http://localhost:3000/housing")

            expect(req.status).toEqual(200)
        });

        test("GET /:id", async () => {
            let req = await fetch("http://localhost:3000/housing/2")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                id: 2,
                name: expect.any(String),
                type: expect.any(String),
                students: expect.any(String),
                distance: expect.any(String),
                address: expect.any(String),
                imageURL: expect.any(String),
                updated: expect.any(String),
            })
        })

        test("GET /:invalid-id", async () => {
            let req = await fetch("http://localhost:3000/housing/2s")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})

        })

        test("GET /:unknown-id to return an 404", async () => {
            let req = await fetch("http://localhost:3000/housing/100")

            expect(req.status).toEqual(404)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("GET /name/:name", async () => {
            let req = await fetch("http://localhost:3000/housing/name/South%House")

            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject(mockHousing)

        })

    })

    describe("Invalid Authorization header", () => {
        // No Authorization header
        test("POST / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("PUT / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/housing/162499", {
                method: "PUT"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/housing/162499", {
                method: "DELETE"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        // Sent with header, but invalid key
        test("POST / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/housing", {
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
            let req = await fetch("http://localhost:3000/housing/2", {
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
            let req = await fetch("http://localhost:3000/housing/15", {
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
            let req = await fetch("http://localhost:3000/housing", {
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
            let req = await fetch("http://localhost:3000/housing/1", {
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
            let req = await fetch("http://localhost:3000/housing/12", {
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
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: 1110,
                    type: "Housing 1 type",
                    students: "i32",
                    distance: "1 block",
                    address: "49 road lane drive",
                    imageURL: "picture.img",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid type", async () => {
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Juniper Hall",
                    type: 20,
                    students: "31",
                    distance: "1 block",
                    address: "49 road lane drive",
                    imageURL: "picture.img",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid students", async () => {
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Juniper Hall",
                    type: "Dorm Style",
                    students: 20,
                    distance: "1 block",
                    address: "49 road lane drive",
                    imageURL: "picture.img",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / invalid distance", async () => {
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Juniper Hall",
                    type: "Dorm Style",
                    students: "20",
                    distance: 1,
                    address: "49 road lane drive",
                    imageURL: "picture.img",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / address", async () => {
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Juniper Hall",
                    type: "Dorm Style",
                    students: "20",
                    distance: "1 block",
                    address: 49,
                    imageURL: "picture.img",
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("POST / image", async () => {
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Juniper Hall",
                    type: "Dorm Style",
                    students: "20",
                    distance: "1 block",
                    address: "49 road lane drive",
                    imageURL: 123,
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    })


    describe("Valid Authorization header + key", () => {
        test("POST / to return an 201", async () => {
            let req = await fetch("http://localhost:3000/housing", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "Juniper Hall",
                    type: "Dorm Style",
                    students: "39",
                    distance: "1 block",
                    address: "49 road lane drive",
                    imageURL: "123.img",
                })
            })
            let jsonResponse = await req.json() as Housing
            expect(req.status).toEqual(201)
            expect(jsonResponse).toMatchObject(mockHousing)
        });

        test("PUT / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/housing/2", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    name: "New name",
                    type: "New type",
                    students: "new-students",
                    distance: "new distance",
                    address: "new address",
                    imageURL: "new img",
                })
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                housing: {
                    name: "New name",
                    type: "New type",
                    students: "new-students",
                    distance: "new distance",
                    address: "new address",
                    imageURL: "new img",
                }

            })
        });

        test("DELETE / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/housing/2", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                name: "New name",
                type: "New type",
                students: "new-students",
                distance: "new distance",
                address: "new address",
                imageURL: "new img",
            })
        });

        test("GET deleted housing and return a 404", async () => {
            let req = await fetch("http://localhost:3000/housing/2", {
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
