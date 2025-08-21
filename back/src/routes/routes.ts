import { Router } from "express";

import routerCliente from './cliente.js'
import routerOrcamento from './orcamento.js'
import { autenticacaoUsuario } from "../utils/middleware.js";

const router = Router();

router.use("/cliente", autenticacaoUsuario, routerCliente);
router.use("/orcamento", autenticacaoUsuario, routerOrcamento);

export default router;