import Tarefa from '../models/tarefaModel.js' // ta importando o modelo para criação da tabela

export const create = async (request, response) => {
    const { tarefa, descricao } = request.body
    const status = "pedente"
    if (!tarefa) {
        response.status(400).json({ err: "A tarefa é obrigatória" })
        return
    }
    if (!descricao) {
        response.status(400).json({ err: "A descrição é obrigatória" })
        return
    }

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
    const {id} = request.params
    const {tarefa, descricao, status} = request.body


    //validações
    if(!tarefa){
        response.status(400).json({message: "A tarefa é obrigatória!"})
        return
    }
    if(!status){
        response.status(400).json({message: "O status é obrigatório!"})
        return
    }
    if(!descricao){
        response.status(400).json({message: "A descricao é obrigatória!"})
        return
    }

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
    const {id} = request.params
    const {status} = request.body


    //validações
    if(!status){
        response.status(400).json({message: "O status é obrigatório!"})
        return
    }
    

    const tarefaAtualizada = {
        status
    }

    try {
        const [linhasAfetadas] = await Tarefa.update(tarefaAtualizada, { where: { id } })

        if(linhasAfetadas <= 0){
            response.status(404).json({message: "Tarefa não encontrada"})
            return
        }

        response.status(200).json({message: "Status da tarefa atualizada!"})
    } catch (error) {
        response.status(500).json({err: "Erro ao atualizar status da tarefa"})
    }
}

export const getByStatus = async (request, response) => {
    // CÓDIGO CORRIGIDO

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