import express, {type Response, type Request} from "express"

const router = express.Router()

router
    .get("/", (_: Request, res: Response) => {
        res.setHeader("Content-Type", "text/plain")
        res.status(200).send("Champlain API");
    })

export default router