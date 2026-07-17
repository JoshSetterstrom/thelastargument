import { rateLimit } from 'express-rate-limit';

const createRateLimitResponse = message => ({
    error: { code: 'RATE_LIMITED', message }
});

export const gameMessageLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 20,

    standardHeaders: true,
    legacyHeaders: false,

    message: createRateLimitResponse('Transmission frequency exceeded. Try again shortly.')
});