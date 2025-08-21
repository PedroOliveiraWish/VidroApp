// Importando a classe OrcamentoService responsável pela lógica de negócios
import { OrcamentoService } from "../service/orcamento.js";
import { ClienteService } from "../service/cliente.js";
// Importando os tipos referentes à requisição e à resposta 
import type { Request, Response } from "express";

import PDFDocument from 'pdfkit';

// Instanciando o serviço de orçamentos
const orcamentoService = new OrcamentoService();
const clienteService = new ClienteService();

// Classe responsável pelo controle dos orçamentos
export class OrcamentoController {

    // Método responsável por buscar todos os orçamentos
    async getOrcamentos(req: Request, res: Response) {
        try {
            const orcamentos = await orcamentoService.getOrcamentos();
            return res.json(orcamentos);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }

    // Método responsável por cadastrar um novo orçamento
    // É recebida a requisição com os dados do orçamento
    // Os dados são o ID do cliente, o valor e a descrição do orçamento
    async cadastrarOrcamento(req: Request, res: Response) {
        try {
            const { clienteId, valor, descricao } = req.body;

            // Caso algum dado não esteja presente no corpo da requisição, retorna um erro 400
            if (!clienteId || !valor || !descricao) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const novoOrcamento = await orcamentoService.cadastrarOrcamento({ clienteId, valor, descricao });
            return res.status(201).json(novoOrcamento);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }

    // Método responsável por atualizar o estado de um orçamento
    // É recebida a requisição com os dados do orçamento
    // No params é recebido o ID do orçamento
    // No body é recebido o novo estado do orçamento
    async atualizarEstadoOrcamento(req: Request, res: Response) {
        try {
            const { orcamentoId } = req.params;
            const { novoEstado } = req.body;

            // Caso o novo estado não seja fornecido, retorna um erro 400
            if (!novoEstado) {
                return res.status(400).json({ error: 'O campo estado é obrigatório' });
            }

            const orcamentoIdNumber = Number(orcamentoId);

            // Caso o orcamentoId não seja fornecido ou não seja um número válido, retorna um erro 400
            if (!orcamentoId || isNaN(orcamentoIdNumber)) {
                return res.status(400).json({ error: 'orcamentoId deve ser um número válido' });
            }

            const orcamentoAtualizado = await orcamentoService.atualizarEstadoOrcamento({ orcamentoId: orcamentoIdNumber, novoEstado });
            return res.json(orcamentoAtualizado);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }

    // Método responsável por deletar um orçamento
    // É recebida a requisição com o ID do orçamento a ser deletado
    async deletarOrcamento(req: Request, res: Response) {
        try {
            const { orcamentoId } = req.params;

            const orcamentoIdNumber = Number(orcamentoId);
            if (!orcamentoId || isNaN(orcamentoIdNumber)) {
                return res.status(400).json({ error: 'orcamentoId deve ser um número válido' });
            }

            await orcamentoService.deletarOrcamento(orcamentoIdNumber);
            return res.status(204).send();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }

    // Método responsável por gerar o link do WhatsApp para enviar o orçamento em pdf para o usuário
    async gerarLinkWhatsapp(req: Request, res: Response) {
        try {
            const { orcamentoId, clienteId } = req.params;

            const orcamentoIdNumber = Number(orcamentoId);
            if (!orcamentoId || isNaN(orcamentoIdNumber)) {
                return res.status(400).json({ error: 'orcamentoId deve ser um número válido' });
            }

            const clienteIdNumber = Number(clienteId);
            if (!clienteId || isNaN(clienteIdNumber)) {
                return res.status(400).json({ error: 'clienteId deve ser um número válido' });
            }

            const orcamento = await orcamentoService.getOrcamentoById(orcamentoIdNumber);
            if (!orcamento) {
                return res.status(404).json({ error: 'Orçamento não encontrado' });
            }

            const cliente = await clienteService.obterClientePorId(clienteIdNumber);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            // Gera o link para download do PDF
            const pdfLink = `http://localhost:3000/orcamentos/${orcamento.id}/pdf/download`;

            // Gera a mensagem para o WhatsApp
            const mensagem = `Olá! Segue seu orçamento:\nDescrição: ${orcamento.descricao}\nValor: R$ ${orcamento.valor.toFixed(2)}\n\nClique aqui para acessar o PDF: ${pdfLink}`;

            // Envia a mensagem pelo WhatsApp
            const whatsappLink = `https://wa.me/${cliente.telefone}?text=${encodeURIComponent(mensagem)}`;

            // Retorna para o front o link
            return res.json({ whatsappLink });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }

    // Método responsável por fazer o download do PDF do orçamento
    async downloadPdf(req: Request, res: Response) {
        try {
            const { orcamentoId } = req.params;

            const orcamentoIdNumber = Number(orcamentoId);
            if (!orcamentoId || isNaN(orcamentoIdNumber)) {
                return res.status(400).json({ error: 'orcamentoId deve ser um número válido' });
            }

            const orcamento = await orcamentoService.getOrcamentoById(orcamentoIdNumber);
            if (!orcamento) {
                return res.status(404).json({ error: 'Orçamento não encontrado' });
            }

            const clienteOrcamento = await clienteService.obterClientePorId(orcamento.id_cliente);
            if (!clienteOrcamento) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            // Configura headers HTTP para download
            res.setHeader('Content-Disposition', `attachment; filename=orcamento-${orcamento.id}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');

            // Cria PDF em tempo real e envia direto para o cliente
            const doc = new PDFDocument();
            doc.pipe(res);

            doc.fontSize(18).text('Orçamento', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Cliente: ${clienteOrcamento.nome}`);
            doc.text(`Descrição: ${orcamento.descricao}`);
            doc.text(`Valor: R$ ${orcamento.valor.toFixed(2)}`);

            doc.end();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }
}