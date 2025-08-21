import { Router } from "express";
import { ClienteController } from "../controller/cliente.js";

const router = Router();
const clienteController = new ClienteController();

router.get("/get-clientes", (req, res) => clienteController.getClientes(req, res));

router.post("/cadastrar-cliente", (req, res) => clienteController.cadastrarCliente(req, res));

export default router;
