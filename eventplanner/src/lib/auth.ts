import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-super-secret-key'
const JWT_EXPIRES_IN = '7d'

export interface TokenPayload {
    userId: string
    email: string
    role: 'USER' | 'ADMIN'
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
}

export async function getUserFromToken(token: string) {
    try {
        const payload = verifyToken(token)

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, email: true, name: true, role: true }
        })
        return user
    } catch (error) {
        return null
    }
}

