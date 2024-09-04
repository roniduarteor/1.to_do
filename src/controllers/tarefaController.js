import Tarefa from '../models/tarefaModel.js' // ta importando o modelo para criação da tabela
import { z } from 'zod'
import formatZodError from '../helpers/formatZodError.js'
import { createSchema } from '../helpers/schema.js'

// Validações com ZOD
const buscarTarefaPorSituacaoSchema = z.object({
    situacao: z.enum(["pedente", "concluida"])
})

const updateTarefaSchema = z.object({
    tarefa: z
    .string()
    .min(3, {message: "A tarefa deve ter pelo menos 3 caracteres"})
    .transform((txt)=> txt.toLowerCase()),

    descricao: z
    .string()
    .min(3, {message: "A descrição deve ter pelo menos 5 caracteres"}),

    situacao: z
    .enum(["pedente", "concluida"])
})



export const create = async (request, response) => {
    
    //implementar a validação
    const bodyValidation = createSchema.safeParse(request.body)
    
    if(!bodyValidation.success){
        response.status(400).json({
            message: "Os dados recebidos no corpo da requisição são inválidos", 
            detalhes: formatZodError(bodyValidation.error)
        })
        return
    }
    
    
    const { tarefa, descricao } = request.body
    const status = "pedente"
    


    const novaTarefa = { // informações que vão ser inseridas
        tarefa,
        descricao,
        status
    }

    try { // para fazer o cadastro
        await Tarefa.create(novaTarefa) // Cria a tarefa de acordo com o modelo que a gente criou da tabela lá em models (Tarefa), e coloca as informações que estamos inserindo (novaTarefa)
        response.status(201).json({ message: "Tarefa cadastrada" })
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Erro ao cadastrar nova tarefa" })
    }
}

// tarefas?page=1&limit=10
export const getAll = async (request, response) => {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const offset = (page - 1) * limit

    try {
        const tarefas = await Tarefa.findAndCountAll({
            limit,
            offset
        })
        // console.log(page, limit, offset)
        const totalPaginas = Math.ceil(tarefas.count / limit)
        response.status(200).json({
            totalTarefas: tarefas.count,
            totalPaginas,
            paginaAtual: page,
            itemsPorPagina: limit,
            proximaPagina: totalPaginas === 0 ? null: `http://localhost:3333/tarefas?page=${page + 1}`,
            tarefas: tarefas.rows
        })
    } catch (error) {
        response.status(500).json({ message: "Erro ao buscar tarefas" })
    }
}

export const getTarefa = async (request, response) => {
    const {id} = request.params
    try {
        // const tarefa = await Tarefa.findOne({where: {id}})
        const tarefa = await Tarefa.findByPk(id)

        if(tarefa === null){
            response.status(404).json({message: "Tarefa não encontrada"})
            return
        }

        response.status(200).json(tarefa)
    } catch (error) {
        response.status(500).json({message: "Erro ao buscar tarefa"})
    }
}

export const updateTarefa = async (request, response) => {
    const paramValidator = getSchema.safeParse(request.params)
    if(!paramValidator.success){
        response.status(400).json({
            message: "Número de identificação está inválido",
            detalhes: formatZodError(paramValidator.error)
    })
    return
    }
    
    const updateValidator = updateTarefaSchema.safeparse(request.body)
    if(!updateValidator.sucess){
        response.status(400).json({
            message: "Dados para atualização inválidos",
            details: formatZodError(updateValidator.error)
        })
        return
    }

    const {id} = request.params
    const {tarefa, descricao, status} = request.body

    const tarefaAtualizada = {
        tarefa,
        descricao,
        status
    }

    try {
        const [linhasAfetadas] = await Tarefa.update(tarefaAtualizada, { where: { id } })

        if(linhasAfetadas <= 0){
            response.status(404).json({message: "Tarefa não encontrada"})
            return
        }

        response.status(200).json({message: "Tarefa atualizada!"})
    } catch (error) {
        response.status(500).json({err: "Erro ao atualizar tarefa"})
    }

}

export const updateStatus = async (request, response) => {
    // ---- CÓDIGO DO PROFESSOR ----

    const paramValidator = getSchema.safeParse(request.params)
    if(!paramValidator.success){
        response.status(400).json({
            message: "Número de identificação está inválido",
            detalhes: formatZodError(paramValidator.error)
    })
    return
    }
    
    const {id} = request.params
    try {
        const tarefa = await Tarefa.findOne({ raw: true, where: {id} })
        if(tarefa === null) {
            response.status(404).json({message: "Tarefa não encontrada"})
            return
        }

        if(tarefa.status === "pedente"){
            await Tarefa.update({status: "concluida"}, {where: {id}})
        }else if(tarefa.status === "concluida"){
            await Tarefa.update({status: "pedente"}, {where: {id}})
        }

        // nova consulta
        const tarefaAtualizada = await Tarefa.findOne ({ raw: true, where: {id}})
        response.status(200).json(tarefaAtualizada)

        console.log(tarefa.status)
    } catch (error) {
        console.log(error)
        response.status(500).json({message: "Erro ao atualizar status da tarefa"})
        return
    }
    
    
    // ---- MEU CÓDIGO ----
    
    // const {id} = request.params
    // const {status} = request.body


    // //validações
    // if(!status){
    //     response.status(400).json({message: "O status é obrigatório!"})
    //     return
    // }
    

    // const tarefaAtualizada = {
    //     status
    // }

    // try {
    //     const [linhasAfetadas] = await Tarefa.update(tarefaAtualizada, { where: { id } })

    //     if(linhasAfetadas <= 0){
    //         response.status(404).json({message: "Tarefa não encontrada"})
    //         return
    //     }

    //     response.status(200).json({message: "Status da tarefa atualizada!"})
    // } catch (error) {
    //     response.status(500).json({err: "Erro ao atualizar status da tarefa"})
    // }
}

export const getByStatus = async (request, response) => {
    // CÓDIGO CORRIGIDO

    const situacaoValidation = buscarTarefaPorSituacaoSchema.safeParse(request.params)
    if(!situacaoValidation.success){
        response.status(400).json({
            message: "Situação inválida",
            details: formatZodError(situacaoValidation.error)
        })
        return
    }

    const {situacao} = request.params
    if(situacao !== "pedente" || situacao !== "concluida"){
        response.status(500).json({
            message: "Situação inválida. Use 'pedente' ou 'concluida'"
        })
        return
    }
    try {
        const tarefas = await Tarefa.findAll({
            where: { status: situacao},
            raw: true,
        })
        response.status(200).json(tarefas)
    } catch (error) {
        console.error(error)
        response.status(500).json({err: "Erro ao buscar tarefa"})
    }
    
    
    
    // ---- MEU CÓDIGO ----
    
    // const {status} = request.params
    // try {
    //     const tarefa = await Tarefa.findOne({where: {status}})

    //     if(tarefa === null){
    //         response.status(404).json({message: "Tarefa não encontrada"})
    //         return
    //     }

    //     response.status(200).json(tarefa)
    // } catch (error) {
    //     response.status(500).json({message: "Erro ao buscar tarefa"})
    //     console.log(error)
    //     return
    // }
}  