// authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken'
import jwksRsa from 'jwks-rsa'
import { AuthenticatedRequest, User } from '../types/index.js';
import UserService from '../services/user-service.js';

const jwksClient = jwksRsa({
  jwksUri: process.env.SUPABASE_JWT_JWKS_URL!,
  cache: true,
  rateLimit: true
})

function getKey(header: JwtHeader, callback: SigningKeyCallback) {
  jwksClient.getSigningKey(header.kid!, (err, key) => {
    if (err) return callback(err)
    const signingKey = key!.getPublicKey()
    callback(null, signingKey)
  })
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401)
  }

  const token = authHeader.replace('Bearer ', '')

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['ES256'],
      issuer: process.env.SUPABASE_JWT_ISSUER,
      audience: process.env.SUPABASE_JWT_AUDIENCE
    },
    async (err, decoded: any) => {
      if (err) {
        return res.sendStatus(401)
      }

      req.auth = {
        supabaseUserId: decoded.sub,
        email: decoded.email
      }

      // Check if user exists in database, create if not
      try {
        const userService = new UserService();
        let user = await userService.getUser(decoded.sub);

        if (!user) {
          const newUser: User = {
            id: decoded.sub,
            email: decoded.email || '',
            first_name: null,
            last_name: null,
          };
          user = await userService.createUser(newUser);
        }

        req.user = user;
        next();
      } catch (error) {
        console.error('Error checking/creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  )
}
