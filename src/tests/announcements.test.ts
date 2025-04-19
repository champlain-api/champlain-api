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
import type {Announcement} from "../types/announcement.ts";

beforeAll(async () => {
    request(app)
})


describe("/announcements", () => {

    // TODO: see if the style and types are valid enums
    // @ts-ignore -- ignoring the updated property
    const mockAnnouncement: Announcement = {
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        type: expect.any(Array),
        style: expect.any(String)
    }


    describe("GET requests", () => {

        test("GET / to return a 200", async () => {
            let req = await fetch("http://localhost:3000/announcements")

            expect(req.status).toEqual(200)
        });

        test("GET / with missing type value", async () => {
            let req = await fetch("http://localhost:3000/announcements?type[]=")

            expect(req.status).toEqual(400)
        })

        test("GET / with invalid type value", async () => {
            let req = await fetch("http://localhost:3000/announcements?type=TEST")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})

        })

        test("GET / with invalid type value (not array)", async () => {
            let req = await fetch("http://localhost:3000/announcements?type=WEB")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})

        })

        test("GET / with valid type value", async () => {
            let req = await fetch("http://localhost:3000/announcements?type[]=WEB")

            expect(req.status).toEqual(200)
            let receivedAnnouncement = await req.json() as Announcement[]

            expect(receivedAnnouncement[0]).toEqual(expect.objectContaining({
                updated: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                type: expect.any(Array),
                style: expect.any(String)
            }))
            expect(req.status).toEqual(200)
        })

        test("GET /:id to return a specific announcement", async () => {
            let req = await fetch("http://localhost:3000/announcements/1")
            let receivedAnnouncement = await req.json() as Announcement

            expect(req.status).toEqual(200)
            expect(receivedAnnouncement).toEqual(expect.objectContaining({
                id: 1,
                updated: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                type: expect.any(Array),
                style: expect.any(String)
            }))
        });

        test("GET /:invalid-id to return an 400", async () => {
            let req = await fetch("http://localhost:3000/announcements/2s")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("GET /:unknown-id to return an 404", async () => {
            let req = await fetch("http://localhost:3000/announcements/100")

            expect(req.status).toEqual(404)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    })

    describe("Invalid Authorization header", () => {
        // No Authorization header
        test("POST / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/announcements", {
                method: "POST"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("PUT / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/announcements/162499", {
                method: "PUT"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/announcements/162499", {
                method: "DELETE"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        // Sent with header, but invalid key
        test("POST / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/announcements", {
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
            let req = await fetch("http://localhost:3000/announcements/162499", {
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
            let req = await fetch("http://localhost:3000/announcements/162499", {
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
            let req = await fetch("http://localhost:3000/announcements", {
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
            let req = await fetch("http://localhost:3000/announcements/162499", {
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
            let req = await fetch("http://localhost:3000/announcements/162499", {
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
        test("POST / to return an 400 and an error", async () => {
            let req = await fetch("http://localhost:3000/announcements", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    title: "valid title",
                    description: 20,
                    type: ["WEB"],
                    style: "INFO"
                })
            })
            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    })


    describe("Valid Authorization header + key", () => {
        test("POST / to return an 200 and the new announcement", async () => {
            let req = await fetch("http://localhost:3000/announcements", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    title: "valid title",
                    description: "valid description",
                    type: ["WEB"],
                    style: "INFO"
                })
            })
            let jsonResponse = await req.json() as Announcement
            expect(req.status).toEqual(200)
            expect(jsonResponse).toMatchObject(mockAnnouncement)
        });

        test("PUT / to return an 200 and the new announcement", async () => {
            let req = await fetch("http://localhost:3000/announcements/3", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    title: "new title",
                    description: "new description",
                    type: ["WEB"],
                    style: "INFO"
                })
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                announcement: {
                    title: "new title",
                    description: "new description",
                    type: ["WEB"],
                    style: "INFO"
                }
            })
        });

        test("DELETE / to return an 200 and the new announcement", async () => {
            let req = await fetch("http://localhost:3000/announcements/3", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer all-scopes",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({

                title: "new title",
                description: "new description",
                type: ["WEB"],
                style: "INFO"

            })
        });

        test("GET deleted announcement and return a 404", async () => {
            let req = await fetch("http://localhost:3000/announcements/3", {
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


