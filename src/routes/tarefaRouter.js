import { Router } from "express"
import { create, getAll, getByStatus, getTarefa, updateStatus, updateTarefa } from "../controllers/tarefaController.js"

const router = Router()

router.get("/", getAll)
router.get("/:id", getTarefa)
router.post("/", create)
router.put("/:id", updateTarefa)
router.put("/:id/status", updateStatus)
router.get("/status/:situacao", getByStatus)

export default router