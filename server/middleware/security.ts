import rateLimit from 'express-rate-limit';

// Rate limiter for authentication endpoints (prevents brute-force / dictionary attacks)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 auth requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts from this IP address. Please wait 15 minutes and try again.'
  }
});

// Rate limiter for form submissions (enquiries, partner, hiring, instructor applications)
export const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // limit each IP to 20 form submissions per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many submissions received from this network. Please wait a few minutes before submitting another request.'
  }
});

// General API rate limiter to protect against denial-of-service and aggressive scraping
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // limit each IP to 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please slow down and try again.'
  }
});
