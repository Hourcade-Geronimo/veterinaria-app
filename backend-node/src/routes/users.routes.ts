import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { verifyToken } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const usersProxy = createProxyMiddleware({
  target: process.env.CSHARP_API_URL,
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});

router.use(verifyToken);

router.get('/', (req, res, next) => {
  req.url = '/api/users';
  next();
}, usersProxy);

router.put('/:id', (req, res, next) => {
  req.url = `/api/users/${req.params.id}`;
  next();
}, usersProxy);

router.delete('/:id', (req, res, next) => {
  req.url = `/api/users/${req.params.id}`;
  next();
}, usersProxy);

export default router;
