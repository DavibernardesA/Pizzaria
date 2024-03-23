import { rateLimit } from 'express-rate-limit';
import { error429 } from '../chat/statusMessage';

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: error429
});

export default limiter;
