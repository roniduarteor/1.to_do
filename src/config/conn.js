import { Sequelize } from "sequelize"

const conn = new Sequelize("todo3E", "root", "Sen@iDev77!.", {
    host: "localhost",
    dialect: "mysql"
})

// Testnado conexão com o banco
// try {
//     await conn.authenticate();
//     console.log('Connection MYSQL')
// } catch (error) {
//     console.error("Erro:", error)
// }

export default conn;