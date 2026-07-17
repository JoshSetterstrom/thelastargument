import express from 'express';

import { getScenarioById, getScenarios } from '../scenarios/index.js';

const router = express.Router();

const formatDuration = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return [minutes.toString().padStart(2, '0'), remainingSeconds.toString().padStart(2, '0')].join(':');
};

const toPublicScenario = scenario => {
    const { code, title, location, objective, description, durationSeconds, difficulty, status, resultContent } = scenario.public;

    return {
        id: scenario.id,
        code,
        title,
        location,
        objective,
        description,
        durationSeconds,
        duration: formatDuration(durationSeconds),
        difficulty,
        status,
        resultContent
    };
};

router.get('/', (req, res) => {
    const scenarios = getScenarios().map(toPublicScenario).sort((a, b) => a.code.localeCompare(b.code));

    res.json(scenarios);
});

export default router;