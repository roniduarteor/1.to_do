import Tarefa from '../models/tarefaModel.js' // ta importando o modelo para criação da tabela

export const create = async (request, response)=>{
    const {tarefa, descricao} = request.body
    const  status = "pedente" 
    if(!tarefa){
        response.status(400).json({err: "A tarefa é obrigatória"})
        return
    }
    if(!descricao){
        response.status(400).json({err: "A descrição é obrigatória"})
        return
    }

    const novaTarefa = { // informações que vão ser inseridas
        tarefa, 
        descricao,
        status
    }

    try { // para fazer o cadastro
        await Tarefa.create(novaTarefa) // Cria a tarefa de acordo com o modelo que a gente criou da tabela lá em models (Tarefa), e coloca as informações que estamos inserindo (novaTarefa)
        response.status(201).json({message: "Tarefa cadastrada"})
    } catch (error) {
        console.error(error)
        response.status(500).json({message: "Erro ao cadastrar nova tarefa"})
    }
}
