import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

interface JwtPayload {
    senha: string;
    nome: string;
}

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const secretKey = process.env.JWT_SECRET || 'your-default-secret-key';

export async function autenticacaoUsuario(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(',')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        if (typeof decoded === 'object' && decoded !== null && 'senha' in decoded && 'nome' in decoded) {
            req.user = decoded as JwtPayload;
            next();
        } else {
            return res.sendStatus(403);
        }
    } catch (err) {
        return res.sendStatus(403);
    }
}

