import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    errors: ['Rate limit exceeded'],
  },
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down and try again in a minute.',
    errors: ['Strict rate limit exceeded'],
  },
});

export const applyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 applications per minute max
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many job applications submitted in a short time. Please wait.',
    errors: ['Application rate limit exceeded'],
  },
});
