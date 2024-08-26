import "dotenv/config"
import express, { request } from "express"
import cors from "cors"

// Importação das rotas
import tarefaRouter from "./routes/tarefaRouter.js"


const PORT = process.env.PORT || 3333

const app = express()

// 3 middleswares
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Utilizar Rotas
app.use("/tarefas", tarefaRouter)

app.use("/", (request, response)=>{
    response.status(404).json({message: "Olá, Mundo!"})
})

app.listen(PORT, ()=>{
    console.log(`Servidor on http://localhost:${PORT}`)
})