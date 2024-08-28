import { Router } from "express"
import { create, getAll, getTarefa } from "../controllers/tarefaController.js"

const router = Router()

router.get("/", getAll)
router.get("/:id", getTarefa)
router.post("/", create)

export default router