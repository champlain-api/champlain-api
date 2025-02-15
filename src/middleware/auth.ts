import { expressjwt } from "express-jwt";
import jwks from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = expressjwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }) as any,
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
});

export default authMiddleware;
