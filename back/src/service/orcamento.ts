// importando o pool de conexões
import pool from "../database.js";

// Classe que representa o serviço de orçamentos
// Responsável por gerenciar as operações relacionadas às consultas ao banco de dados que diz respeito à tabela de orçamento
export class OrcamentoService {

    // Método responsável por buscar todos os orçamentos
    async getOrcamentos() {
        try {
            return await pool.query('SELECT * FROM orcamento');
        } catch (error) {
            throw new Error('Error ao buscar orçamentos');
        }
    }

    // Método responsável por cadastrar um novo orçamento
    // Recebe como parâmetro a descrição, valor e ID do cliente
    async cadastrarOrcamento({descricao, valor, clienteId} : {descricao: string, valor: number, clienteId: number}) {
        try {
            const novoOrcamento = await pool.query('INSERT INTO orcamento (descricao, valor, cliente_id) VALUES ($1, $2, $3) RETURNING *', [descricao, valor, clienteId]);
            return novoOrcamento.rows[0];
        } catch (error) {
            throw new Error('Error ao cadastrar orçamento');
        }
    }

    // Método responsável por atualizar o estado de um orçamento
    // Os estados possíveis são 'pendente', 'recusado' e 'aceito'
    // Recebe como parâmetro o ID do orçamento e o novo estado
    async atualizarEstadoOrcamento({orcamentoId, novoEstado} : {orcamentoId: number, novoEstado: string}) {
        try {
            const orcamentoAtualizado = await pool.query('UPDATE orcamento SET estado = $1 WHERE id = $2 RETURNING *', [novoEstado, orcamentoId]);
            return orcamentoAtualizado.rows[0];
        } catch (error) {
            throw new Error('Error ao atualizar estado do orçamento');
        }
    }

    // Método responsável por deletar um orçamento
    async deletarOrcamento(orcamentoId: number) {
        try {
            await pool.query('DELETE FROM orcamento WHERE id = $1', [orcamentoId]);
        } catch (error) {
            throw new Error('Error ao deletar orçamento');
        }
    }

    // Método responsável por buscar um orçamento pelo ID
    async getOrcamentoById(orcamentoId: number) {
        try {
            const orcamento = await pool.query('SELECT * FROM orcamento WHERE id = $1', [orcamentoId]);
            return orcamento.rows[0];
        } catch (error) {
            throw new Error('Error ao buscar orçamento');
        }
    }
}