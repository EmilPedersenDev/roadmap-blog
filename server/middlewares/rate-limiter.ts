import rateLimit from 'express-rate-limit';
import logger from '../config/logger.js';

const MAX_REQUESTS_PER_MINUTE = 900;
const WINDOW_MS = 60 * 1000; // 1 minute  


const rateLimitExceededMessage: { error: number, message: string } = {
  error: 429,
  message: 'Too many requests, please try again later.',
};

export const globalRateLimiter = rateLimit({
  windowMs: WINDOW_MS, // 1 minute
  max: MAX_REQUESTS_PER_MINUTE, // 900 requests per minute
  message: rateLimitExceededMessage,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(rateLimitExceededMessage);
  },
});
