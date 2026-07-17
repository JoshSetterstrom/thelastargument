import 'dotenv/config';

import express from 'express';

import gamesRouter from './routes/games.js';
import scenariosRouter from './routes/scenarios.js';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';

const app = express();

const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/games', gamesRouter);
app.use('/api/scenarios', scenariosRouter);

app.use((req, res) => {
    res.status(404).json({ error: { code: 'ROUTE_NOT_FOUND', message: 'The requested endpoint does not exist.' } });
});

app.use((req, res, next) => {
    let visitorId = req.signedCookies.visitorId;

    if (!visitorId) {
        visitorId = randomUUID();

        const options = {
            signed: true,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        };

        res.cookie('visitorId', visitorId, options);
    };

    req.visitorId = visitorId;

    next();
});

app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) return next(error);
    

    return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected server error occurred.' } });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});