import 'dotenv/config';

import express from 'express';

import scenariosRouter from './routes/scenarios.js';

const app = express();

const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50kb' }));

app.use('/api/scenarios', scenariosRouter);

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

    if (res.headersSent) {
        return next(error);
    }

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