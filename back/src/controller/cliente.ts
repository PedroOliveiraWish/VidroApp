// Importando a classe ClienteService responsável pela lógica de negócios
import { ClienteService } from "../service/cliente.js";
// Importando os tipos referentes à resposta e à requisição
import type { Response, Request } from "express";

// Instanciando o serviço de clientes
const clienteService = new ClienteService();

// Controlador de clientes
// Responsável pela lógica de controle das requisições e respostas vindas do cliente
export class ClienteController {

    // Método responsável por buscar todos os clientes
    async getClientes(req: Request, res: Response): Promise<Response> {
        try {
            const clientes = await clienteService.getClientes();
            return res.json(clientes);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }

    // Método responsável por cadastrar um novo cliente
    // É recebida na requisição os dados do novo cliente
    // Os dados são o nome e o telefone do cliente
    async cadastrarCliente(req: Request, res: Response): Promise<Response> {
        const { nome, telefone } = req.body;

        // Caso o nome ou telefone não sejam fornecidos retorna um erro 400
        if (!nome || !telefone) {
            return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
        }

        try {
            const novoCliente = await clienteService.cadastrarCliente({ nome, telefone });
            return res.status(201).json(novoCliente);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: errorMessage });
        }
    }
}