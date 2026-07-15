import { randomUUID } from 'node:crypto';

import { selectEvidence } from '../utils/selectEvidence.js';

const gameSessions = new Map();

export const createGameSession = scenario => {
    const startedAt = new Date();

    const {
        trust,
        suspicion,
        ...hiddenInitialState
    } = scenario.game.initialState;

    const selectedEvidence = selectEvidence({
        pool: scenario.game.evidencePool,
        count: scenario.game.evidenceSelection.count,
        groups: scenario.game.evidenceSelection.groups
    });

    const session = {
        id: randomUUID(),
        scenarioId: scenario.id,
        status: 'active',

        startedAt,

        expiresAt: new Date(
            startedAt.getTime() +
            scenario.public.durationSeconds * 1000
        ),

        turnsRemaining: scenario.game.maxTurns,

        publicState: {
            trust,
            suspicion
        },

        hiddenState: {
            ...hiddenInitialState,
            acceptedClaims: [],
            contradictions: [],
            unlockedClueIds: [],
            revealedFactIds: []
        },

        evidence: selectedEvidence.map(evidence => ({
            ...evidence,
            submitted: false
        })),

        messages: scenario.game.openingMessage
            ? [
                {
                    id: randomUUID(),
                    role: 'assistant',
                    content: scenario.game.openingMessage,
                    createdAt: startedAt
                }
            ]
            : [],

        result: null,
        completedAt: null
    };

    gameSessions.set(session.id, session);

    return session;
};

export const getGameSession = sessionId => {
    return gameSessions.get(sessionId);
};

export const saveGameSession = session => {
    gameSessions.set(session.id, session);
    return session;
};

export const deleteGameSession = sessionId => {
    return gameSessions.delete(sessionId);
};