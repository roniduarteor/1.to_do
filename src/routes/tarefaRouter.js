import { Router } from "express"
import { create, getAll, getTarefa, updateTarefa } from "../controllers/tarefaController.js"

const router = Router()

router.get("/", getAll)
router.get("/:id", getTarefa)
router.post("/", create)
router.put("/:id", updateTarefa)

export default router