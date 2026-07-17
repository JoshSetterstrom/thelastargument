import express from 'express';

import { randomUUID } from 'node:crypto';
import { evaluateTurn } from '../services/ai/evaluateTurn.js';
import { getScenarioById } from '../scenarios/index.js';
import { createGameSession, getGameSession, saveGameSession } from '../stores/gameSessions.js';
import { applyTurnResult, completeGameSession, resolveGameOutcome } from '../services/game/gameState.js';
import { toPublicGameSession } from '../serializers/gameSession.js';
import { gameMessageLimiter } from '../middleware/rateLimits.js';

const router = express.Router();

const expireSessionIfNecessary = session => {
    if (session.status === 'active' && Date.now() >= session.expiresAt.getTime()) {
        session.status = 'completed';
        session.result = 'rejected';
        session.completedAt = new Date();

        saveGameSession(session);
    };

    return session;
};

router.post('/', (req, res) => {
    const { scenarioId } = req.body ?? {};

    if (!scenarioId || typeof scenarioId !== 'string') {
        return res.status(400).json({ error: { code: 'SCENARIO_ID_REQUIRED', message: 'A valid scenario ID is required.' } });
    };

    const scenario = getScenarioById(scenarioId);

    if (!scenario) {
        return res.status(404).json({ error: { code: 'SCENARIO_NOT_FOUND', message: 'The requested scenario does not exist.' } });
    };

    if (scenario.public.status !== 'available') {
        return res.status(409).json({ error: { code: 'SCENARIO_UNAVAILABLE', message: 'The requested scenario is not currently available.' } });
    };

    const session = createGameSession(req, scenario);

    return res.status(200).json(toPublicGameSession(session, scenario));
});

router.get('/:gameId', (req, res) => {
    const session = getGameSession(req.params.gameId);

    if (!session || session.ownerId !== req.visitorId) {
        return res.status(404).json({ error: { code: 'GAME_NOT_FOUND', message: 'Negotiation session not found.' } });
    }

    const scenario = getScenarioById(session.scenarioId);

    if (!scenario) {
        return res.status(500).json({ error: { code: 'SCENARIO_CONFIGURATION_MISSING', message: 'The scenario configuration is unavailable.' } });
    };

    if (session.status === 'active') {
        const result = resolveGameOutcome(scenario, session);

        if (result) {
            completeGameSession(session, result);

            saveGameSession(session);
        };
    };

    return res.json(toPublicGameSession(session, scenario));
});

router.post('/:gameId/abandon', (req, res) => {
    const session = getGameSession(req.params.gameId);

    if (session?.ownerId !== req.visitorId) {
        return res.status(404).json({ error: { code: 'GAME_NOT_FOUND', message: 'Negotiation session not found.' } });
    };

    if (session.status !== 'active') {
        return res.status(409).json({ error: { code: 'GAME_NOT_ACTIVE', message: 'This game session is no longer active.' } });
    };

    session.status = 'completed';
    session.result = 'abandoned';
    session.completedAt = new Date();

    saveGameSession(session);

    return res.json({
        id: session.id,
        status: session.status,
        result: session.result,
        completedAt: session.completedAt
    });
});

router.post('/:gameId/messages', gameMessageLimiter, async (req, res) => {
    const session = getGameSession(req.params.gameId);

    if (session?.ownerId !== req.visitorId) {
        return res.status(404).json({ error: { code: 'GAME_NOT_FOUND', message: 'Negotiation session not found.' } });
    };

    const scenario = getScenarioById(session.scenarioId);

    if (!scenario) {
        return res.status(500).json({ error: { code: 'SCENARIO_CONFIGURATION_MISSING', message: 'The scenario configuration is unavailable.' } });
    };

    const expiredOutcome = resolveGameOutcome(scenario, session);

    if (expiredOutcome) {
        completeGameSession(session, expiredOutcome);

        saveGameSession(session);

        return res.status(409).json({
            error: { code: 'GAME_NOT_ACTIVE', message: 'This negotiation session has ended.' },
            data: toPublicGameSession(session, scenario)
        });
    };

    if (session.status !== 'active') {
        return res.status(409).json({ error: { code: 'GAME_NOT_ACTIVE', message: 'This negotiation session is no longer active.' } });
    };

    if (session.isProcessing) {
        return res.status(409).json({ error: { code: 'TURN_ALREADY_PROCESSING', message: 'A previous transmission is still being processed.' } });
    };

    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';

    if (!content || content.length > 800) {
        return res.status(400).json({ error: { code: 'INVALID_MESSAGE', message: 'Transmission must contain between 1 and 800 characters.' } });
    };

    const evidenceId = typeof req.body?.evidenceId === 'string' ? req.body.evidenceId : null;

    if (!content) {
        return res.status(400).json({ error: { code: 'MESSAGE_REQUIRED', message: 'A transmission message is required.' } });
    };

    if (content.length > 800) {
        return res.status(400).json({ error: { code: 'MESSAGE_TOO_LONG', message: 'The transmission cannot exceed 800 characters.' } });
    };

    let attachedEvidence = null;

    if (evidenceId) {
        attachedEvidence = session.evidence.find(evidence => evidence.id === evidenceId);

        if (!attachedEvidence) {
            return res.status(400).json({ error: { code: 'EVIDENCE_NOT_FOUND', message: 'The selected evidence does not exist.' } });
        };

        if (attachedEvidence.submitted) {
            return res.status(409).json({ error: { code: 'EVIDENCE_ALREADY_SUBMITTED', message: 'This evidence has already been submitted.' } });
        };
    };

    session.isProcessing = true;
    saveGameSession(session);

    try {
        const submittedAt = new Date();

        const turnResult = await evaluateTurn({ scenario, session, content, attachedEvidence });

        const playerMessage = {
            id: randomUUID(),
            role: 'user',
            content,
            evidenceId: attachedEvidence?.id ?? null,
            createdAt: submittedAt
        };

        const assistantMessage = {
            id: randomUUID(),
            role: 'assistant',
            content: turnResult.reply,
            createdAt: new Date()
        };

        session.messages.push(playerMessage, assistantMessage);

        if (attachedEvidence) attachedEvidence.submitted = true;

        applyTurnResult(scenario, session, turnResult);

        const result = resolveGameOutcome(scenario, session);
        if (result) completeGameSession(session, result);
        
        session.isProcessing = false;

        saveGameSession(session);

        return res.json(toPublicGameSession(session, scenario));
    } catch (error) {
        session.isProcessing = false;
        saveGameSession(session);

        return res.status(502).json({ error: { code: 'AI_RESPONSE_FAILED', message: 'The intelligence failed to process the transmission. Please try again.' } });
    }
});

export default router;