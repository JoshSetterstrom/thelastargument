import 'dotenv/config';

import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cookieParser from 'cookie-parser';
import express from 'express';

import gamesRouter from './routes/games.js';
import scenariosRouter from './routes/scenarios.js';

const app = express();

const port = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const cookieSecret = process.env.COOKIE_SECRET ?? 'development-only-secret';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const clientDist = path.resolve(dirname, '../../client/dist');

app.set('trust proxy', 1);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser(cookieSecret));

app.use((req, res, next) => {
    let visitorId = req.signedCookies.visitorId;

    if (!visitorId) {
        visitorId = randomUUID();

        res.cookie('visitorId', visitorId, {
            signed: true,
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }

    req.visitorId = visitorId;

    next();
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/games', gamesRouter);
app.use('/api/scenarios', scenariosRouter);

if (isProduction) {
    app.use(express.static(clientDist));

    app.use((req, res, next) => {
        if (req.method !== 'GET' || !req.accepts('html')) {
            return next();
        }

        return res.sendFile(path.join(clientDist, 'index.html'));
    });
}

app.use((req, res) => {
    res.status(404).json({
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: 'The requested endpoint does not exist.'
        }
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) return next(error);

    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected server error occurred.'
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
