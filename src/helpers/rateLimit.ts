import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';
import chat from '../chat/statusMessage';

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: chat.error429
});

export default limiter;
