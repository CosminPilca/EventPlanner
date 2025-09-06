import bcrypt from 'bcryptjs'


export interface HashedPasswordData {
    hashedPassword: string
    salt: string
}

export async function hashPasswordClient(plainPassword: string): Promise<HashedPasswordData> {
    try {
        const salt = await bcrypt.genSalt(12)

        const hashedPassword = await bcrypt.hash(plainPassword, salt)

        return {
            hashedPassword,
            salt
        }
    } catch (error) {
        console.error('Client-side password hashing failed:', error)
        throw new Error('Failed to process password securely')
    }
}


export async function hashPasswordForLogin(plainPassword: string, email: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(10)
        const emailSalt = email.toLowerCase().substring(0, 10).padEnd(10, '0')
        const combinedSalt = salt.substring(0, 20) + emailSalt

        return await bcrypt.hash(plainPassword, combinedSalt)
    } catch (error) {
        console.error('Client-side login hash failed:', error)
        throw new Error('Failed to process credentials securely')
    }
}


export function validatePasswordStrength(password: string) {
    const minLength = 6
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const score = [
        password.length >= minLength,
        hasLowercase,
        hasUppercase,
        hasNumbers,
        hasSpecialChar
    ].filter(Boolean).length

    return {
        isValid: password.length >= minLength && hasLowercase && hasUppercase && hasNumbers,
        score,
        requirements: {
            minLength: password.length >= minLength,
            hasLowercase,
            hasUppercase,
            hasNumbers,
            hasSpecialChar
        }
    }
}