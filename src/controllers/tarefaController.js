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