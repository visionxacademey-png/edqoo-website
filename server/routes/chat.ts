import { Router, type Request, type Response } from 'express';
import { askGemini, getContactInfo, type ChatMessage } from '../services/chatbotService.js';

const router = Router();

// In-Memory rate limiter (40 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 40;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Cleanup rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * GET /api/chat/config
 * Returns public configuration and suggested prompts for the chatbot UI
 */
router.get('/config', (_req: Request, res: Response) => {
  const contactInfo = getContactInfo();

  return res.json({
    enabled: true,
    welcomeMessage: "Hi! 👋 I'm the AI Assistant. I can help you find courses, programs, projects, instructors, and information about our services. What would you like to know?",
    suggestedQuestions: [
      "What courses are available?",
      "Do you have a Python course?",
      "What free courses are available?",
      "What Data Science programs do you offer?",
      "What projects are included?",
      "How can I become an instructor?",
      "How can I become a partner?",
      "How can I contact support?"
    ],
    contactInfo
  });
});

/**
 * POST /api/chat
 * Primary chat endpoint for querying the website AI Assistant
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        answer: 'Too many requests. Please wait a moment before sending more questions.',
        needsContact: true,
        contactInfo: getContactInfo()
      });
    }

    const { message, conversationHistory } = req.body;

    // Validate message
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required and cannot be empty.' });
    }

    const sanitizedMessage = message.trim();

    if (sanitizedMessage.length > 1000) {
      return res.status(400).json({ error: 'Message exceeds maximum limit of 1000 characters.' });
    }

    // Validate conversation history format
    let validHistory: ChatMessage[] = [];
    if (Array.isArray(conversationHistory)) {
      validHistory = conversationHistory
        .filter((item: any) => item && typeof item.content === 'string' && (item.role === 'user' || item.role === 'model' || item.role === 'assistant'))
        .map((item: any) => ({
          role: item.role === 'assistant' ? 'model' : item.role,
          content: String(item.content).slice(0, 1000)
        }))
        .slice(-10); // Keep last 10 turns
    }

    // Call chatbot service (Search First -> Gemini -> Contact)
    const chatResult = await askGemini(sanitizedMessage, validHistory);

    return res.json(chatResult);
  } catch (error: any) {
    console.error('Unhandled chat endpoint error:', error);
    const contactInfo = getContactInfo();

    return res.status(500).json({
      success: false,
      answer: "I'm unable to process your question right now. Please contact our support team directly.",
      source: 'fallback',
      confidence: 'unsupported',
      needsContact: true,
      errorCode: 'AI_SERVICE_UNAVAILABLE',
      contactInfo
    });
  }
});

export default router;
