import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const authProxy = createProxyMiddleware({
  target: process.env.CSHARP_API_URL,
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});

//testing this to avoid using pathrewrite on the authProxy
//used to be:
//router.post('/register', authProxy); 
//router.post('/login', authProxy);
//so, the proxy was sending ṔOST /register to c#
//but it was expecting POST /api/auth/register... i think... i hope
router.post('/register', (req, res, next) => {
  req.url = '/api/auth/register';
  next();
}, authProxy);

router.post('/login', (req, res, next) => {
  req.url = '/api/auth/login';
  next();
}, authProxy);

export default router;
