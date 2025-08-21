import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "your-default-secret-key";

export async function login(req: Request, res: Response) {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
        return res.sendStatus(400);
    }

    if (nome === process.env.ADMIN_USER && senha === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ nome }, secretKey, { expiresIn: "24h" });
        return res.json({ token });
    }

    res.sendStatus(401);
}
