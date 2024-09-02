

export const createSchema = z.object({
    tarefa: z
    .string()
    .min(3, {message: "A tarefa deve ter pelo menos 3 caracteres"})
    .transform((txt)=> txt.toLowerCase()),
    
    descricao: z
    .string()
    .min(5, { message: "A Descricao deve ter pelo menos 5 caracteres"}),
})

export const getSchema = 

