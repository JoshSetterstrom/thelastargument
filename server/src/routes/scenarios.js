import express from 'express';

import { getScenarioById, getScenarios } from '../scenarios/index.js';

const router = express.Router();

const formatDuration = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return [
        minutes.toString().padStart(2, '0'),
        remainingSeconds.toString().padStart(2, '0')
    ].join(':');
};

const toPublicScenario = scenario => {
    const {
        code,
        title,
        location,
        objective,
        description,
        durationSeconds,
        difficulty,
        status,
        resultContent
    } = scenario.public;

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

// router.get('/:scenarioId', (req, res) => {
//     const scenario = getScenarioById(req.params.scenarioId);

//     if (!scenario) {
//         return res.status(404).json({
//             error: {
//                 code: 'SCENARIO_NOT_FOUND',
//                 message: 'The requested scenario does not exist.'
//             }
//         });
//     }

//     return res.json({
//         data: toPublicScenario(scenario)
//     });
// });

export default router;