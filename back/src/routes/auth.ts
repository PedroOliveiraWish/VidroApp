import { login } from "../controller/auth.js";
import { Router } from "express";

const router = Router();

router.post("/login", login);

export default router;