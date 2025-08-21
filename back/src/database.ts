// importando o dotenv para tornar os dados seguros
import { config } from 'dotenv';
// importando as dependências necessárias para conectar o back com o banco de dados usando o pg
import { Pool } from 'pg';

// Habilitando o uso do arquivo .env
config();

// criando a conexão com o banco de dados
const pool = new Pool({
    user: process.env.DATABASE_USER, // usuário do banco de dados
    host: process.env.DATABASE_HOST, // host do banco de dados
    database: process.env.DATABASE_NAME, // nome do banco de dados
    password: process.env.DATABASE_PASSWORD, // senha do banco de dados
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined, // porta do banco de dados
})

// exportando a conexão com o banco de dados
export default pool;