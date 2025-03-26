import {expect, test, describe, beforeAll} from "bun:test";
import type {Shuttle} from "../types/shuttle.d.ts"
import request from "supertest"
import {app} from "../index.ts"

beforeAll(async () => {
    request(app)
})


describe("/shuttles", () => {
    // @ts-ignore -- ignoring the updated property
    const mockShuttle: Shuttle = {
        direction: expect.any(Number),
        id: expect.any(Number),
        lat: expect.any(Number),
        lon: expect.any(Number),
        mph: expect.any(Number),
    }

    describe("GET requests", () => {

        test("GET / to return a 200", async () => {
            let req = await fetch("http://localhost:3000/shuttles")
            let receivedShuttles = await req.json() as Shuttle[]

            expect(req.status).toEqual(200)
            expect(receivedShuttles[Math.floor(Math.random() * receivedShuttles.length)]).toEqual(expect.objectContaining(mockShuttle))

        });

        test("GET / with missing updatedWithin value", async () => {
            let req = await fetch("http://localhost:3000/shuttles?updatedWithin=")

            expect(req.status).toEqual(400)
        })

        test("GET / with invalid updatedWithin value (NaN)", async () => {
            let req = await fetch("http://localhost:3000/shuttles?updatedWithin=invalid")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})

        })

        test("GET / with invalid updatedWithin value (out of range)", async () => {
            let req = await fetch("http://localhost:3000/shuttles?updatedWithin=600")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})

        })

        test("GET / with valid updatedWithin parameter", async () => {
            let req = await fetch("http://localhost:3000/shuttles?updatedWithin=2")

            expect(req.status).toEqual(200)
            let receivedShuttle = await req.json() as Shuttle[]

            expect(req.status).toEqual(200)
            expect(receivedShuttle[0]).toEqual(expect.objectContaining({
                direction: expect.any(Number),
                id: expect.any(Number),
                lat: expect.any(Number),
                lon: expect.any(Number),
                mph: expect.any(Number),
            }))
        })

        test("GET /:id to return a specific shuttle", async () => {
            let req = await fetch("http://localhost:3000/shuttles/1")
            let receivedShuttle = await req.json() as Shuttle[]

            expect(req.status).toEqual(200)
            expect(receivedShuttle[0]).toEqual(expect.objectContaining({
                direction: expect.any(Number),
                id: 1,
                lat: expect.any(Number),
                lon: expect.any(Number),
                mph: expect.any(Number),
            }))
        });

        test("GET /:invalid-id to return an 400", async () => {
            let req = await fetch("http://localhost:3000/shuttles/2s")

            expect(req.status).toEqual(400)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("GET /:unknown-id to return an 404", async () => {
            let req = await fetch("http://localhost:3000/shuttles/100")

            expect(req.status).toEqual(404)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });
    })
    describe("Invalid Authorization header", () => {
        // No Authorization header
        test("POST / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/shuttles", {
                method: "POST"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("PUT / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/shuttles/162499", {
                method: "PUT"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        test("DELETE / (no API key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/shuttles/162499", {
                method: "DELETE"
            })
            expect(req.status).toEqual(401)
            expect(await req.json()).toMatchObject({error: expect.any(String)})
        });

        // Sent with header, but invalid key
        test("POST / (header, no key) to return an 401", async () => {
            let req = await fetch("http://localhost:3000/shuttles", {
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
            let req = await fetch("http://localhost:3000/shuttles/162499", {
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
            let req = await fetch("http://localhost:3000/shuttles/162499", {
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
            let req = await fetch("http://localhost:3000/shuttles", {
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
            let req = await fetch("http://localhost:3000/shuttles/162499", {
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
            let req = await fetch("http://localhost:3000/shuttles/162499", {
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

    describe("Valid Authorization header + key", () => {
        test("POST / to return an 200 and the new shuttle", async () => {
            let req = await fetch("http://localhost:3000/shuttles", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer shuttle-edit",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    direction: 0,
                    mph: 15,
                    lat: -42,
                    lon: 72
                })
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                id: expect.any(Number),
                direction: expect.any(Number),
                mph: expect.any(Number),
                lat: expect.any(Number),
                lon: expect.any(Number),
                updated: expect.any(String)
            })
        });

        test("PUT / to return an 200 and the shuttle", async () => {
            let req = await fetch("http://localhost:3000/shuttles/2", {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer shuttle-edit",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    direction: 200,
                    id: 2,
                    lat: 101,
                    lon: 120,
                    mph: 2,
                })
            })
            let receivedShuttle = await req.json() as Shuttle
            expect(req.status).toEqual(200)

            expect(receivedShuttle).toMatchObject({
                direction: 200,
                id: 2,
                lat: 101,
                lon: 120,
                mph: 2,
                updated: expect.any(String)
            })
        });

        test("DELETE / to return an 200", async () => {
            let req = await fetch("http://localhost:3000/shuttles/2", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer shuttle-edit",
                    "Content-type": "application/json",
                }
            })
            expect(req.status).toEqual(200)
            expect(await req.json()).toMatchObject({
                direction: 200,
                id: 2,
                lat: 101,
                lon: 120,
                mph: 2
            })
        });
    })


});


