// Importando o pool de conexão do banco de dados
import pool from "../database.js";

// Classe que representa o serviço de clientes
// Responsável por gerenciar as operações relacionadas às consultas ao banco de dados que diz respeito à tabela de clientes
export class ClienteService {

    // Método responsável por buscar todos os clientes
    async getClientes() {
        try {
            return await pool.query('SELECT * FROM cliente');
        } catch (error) {
            throw new Error('Error ao buscar clientes');
        }
    }

    // Método responsável por cadastrar um novo cliente
    // Recebe como parâmetro o nome e telefone do cliente
    async cadastrarCliente({nome, telefone} : {nome: string, telefone: string}) {
        try {
            const novoCliente = await pool.query('INSERT INTO cliente (nome, telefone) VALUES ($1, $2) RETURNING *', [nome, telefone]);
            return novoCliente.rows[0];
        } catch (error) {
            throw new Error('Error ao cadastrar cliente');
        }
    }

    async obterClientePorId(clienteId: number) {
        try {
            const cliente = await pool.query('SELECT * FROM cliente WHERE id = $1', [clienteId]);
            return cliente.rows[0];
        } catch (error) {
            throw new Error('Error ao buscar cliente');
        }
    }
}