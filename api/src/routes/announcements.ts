import express, {type Response, type Request} from "express"

const router = express.Router()
import prisma from "../prisma_client.ts"

router.use(express.json())
router
    .get("/", async (req: Request, res: Response) => {
        // Fetch the announcements from the database
        const announcement = await prisma.announcement.findMany({
            orderBy: {
                id: "asc"
            }
        })

        // Set the content-type header and return the announcement.
        res.setHeader("Content-Type", "application/json")
        res.json(announcement)


    })
    .get("/:id", async (req: Request, res: Response) => {
        const id: number = Number(req.params.id) || -1

        const announcement = await prisma.announcement.findFirst({
            where: {
                id: id
            }
        })
        if (announcement == null) {
            res.status(404).json({error: "No announcement found with that id."})
            return
        }

        res.setHeader("Content-Type", "application/json")
        res.json(announcement)
    })
    .post("/", async (req: Request, res: Response) => {
        const {title, description, type, style} = req.body
        res.setHeader("Content-Type", "application/json")

        let announcement;
        try {
            announcement = await prisma.announcement.create({
                data: {
                    title: title,
                    description: description,
                    type: type,
                    style: style
                }
            })
        } catch (e) {
            console.log(e)
            res.status(400).json({error: "Unable to create announcement."})
            return
        }
        res.status(201).json(announcement)
        return
    })
    .put("/:id", async (req: Request, res: Response) => {
        const id = Number(req.params.id) || null
        const {title, description, type, style} = req.body
        res.setHeader("Content-Type", "application/json")
        if (id == null) {
            res.status(400).json({error: "Invalid announcement id."})
            return
        }

        let announcement;
        try {
            announcement = await prisma.announcement.update({
                where: {
                    id: id!
                },
                data: {
                    title: title,
                    description: description,
                    type: type,
                    style: style

                }
            })
        } catch {
            res.status(404).json({error: "Invalid announcement id"})
        }
        res.status(200).json({announcement})
    })

    .delete("/:id", async (req: Request, res: Response) => {
        const id: number = Number(req.params.id) || -1
        res.setHeader("Content-Type", "application/json")
        let announcement;
        try {
            announcement = await prisma.announcement.delete({
                where: {
                    id: id
                }
            })
        } catch {
            res.status(400).json({error: "Unable to delete announcement. Check the id."})
            return
        }
        res.status(200).send(announcement)

    })


export default router