import {parse} from 'cookie'
import { configDotenv } from 'dotenv'
import jwt from 'jsonwebtoken'

configDotenv()

export async function requireUser(request: Request) {
    const cookie = request.headers.get("Cookie") || ''
    const token = parse(cookie).token
    
    if(!token) return false
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
}