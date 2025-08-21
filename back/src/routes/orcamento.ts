import { Router } from "express";
import { OrcamentoController } from "../controller/orcamento.js";

const orcamentoController = new OrcamentoController();
const router = Router();

router.get("/get-orcamentos", (req, res) => orcamentoController.getOrcamentos(req, res));

router.get('/whatsapp-link/:orcamentoId/:clienteId', (req, res) => orcamentoController.gerarLinkWhatsapp(req, res));

router.get('/orcamentos/:orcamentoId/pdf/download', (req, res) => orcamentoController.downloadPdf(req, res));

router.post("/cadastrar-orcamento", (req, res) => orcamentoController.cadastrarOrcamento(req, res));

router.put("/atualizar-estado-orcamento/:orcamentoId", (req, res) => orcamentoController.atualizarEstadoOrcamento(req, res));

router.delete("/deletar-orcamento/:orcamentoId", (req, res) => orcamentoController.deletarOrcamento(req, res));

export default router;