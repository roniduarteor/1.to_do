import "dotenv/config"
import express, { request } from "express"
import cors from "cors"

// Importar Conexão com o Banco de Dados
import conn from "./config/conn.js"

// Importar os Modelos
import Tarefa from './models/tarefaModel.js'

// Importação das rotas
import tarefaRouter from "./routes/tarefaRouter.js"


const PORT = process.env.PORT || 3333

const app = express()

// conexão com o banco
conn.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor on http://localhost:${PORT}`)
    })
}).catch(() => console.error(error))

// 3 middleswares
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Utilizar Rotas
app.use("/tarefas", tarefaRouter)

app.use("/", (request, response) => {
    response.status(404).json({ message: "Olá, Mundo!" })
})

