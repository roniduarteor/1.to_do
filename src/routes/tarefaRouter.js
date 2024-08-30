import { Router } from "express"
import { create, getAll, getTarefa, updateStatus, updateTarefa } from "../controllers/tarefaController.js"

const router = Router()

router.get("/", getAll)
router.get("/:id", getTarefa)
router.post("/", create)
router.put("/:id", updateTarefa)
router.put("/status/:id", updateStatus)

export default router