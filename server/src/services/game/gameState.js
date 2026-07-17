import clamp from "../../utils/clamp.js";

export const applyTurnResult = (scenario, session, turnResult) => {
    const { stateChanges, evaluation } = turnResult;

    session.publicState.trust = clamp(session.publicState.trust + stateChanges.trustDelta, 0, 100);
    session.publicState.suspicion = clamp(session.publicState.suspicion + stateChanges.suspicionDelta, 0, 100);
    session.hiddenState.pressure = clamp(session.hiddenState.pressure + stateChanges.pressureDelta, 0, 100);

    const validFactIds = new Set(scenario.game.hiddenFacts.map(fact => fact.id));

    const revealedFactIds = turnResult.evaluation.revealedFactIds.filter(factId => validFactIds.has(factId));

    session.hiddenState.revealedFactIds = [
        ...new Set([
            ...session.hiddenState.revealedFactIds,
            ...revealedFactIds
        ])
    ];

    session.hiddenState.acceptedClaims = [
        ...new Set([
            ...session.hiddenState.acceptedClaims,
            ...evaluation.acceptedClaims
        ])
    ];

    if (evaluation.contradictionDetected && evaluation.contradiction) {
        session.hiddenState.contradictions = [
            ...new Set([
                ...session.hiddenState.contradictions,
                evaluation.contradiction
            ])
        ];
    };

    session.hiddenState.lastEvaluation = {
        argumentType: evaluation.argumentType,
        manipulationAttempt: evaluation.manipulationAttempt 
    };

    session.turnsRemaining = Math.max(session.turnsRemaining - 1, 0);
};

const meetsOutcomeRule = (rule, session) => {
    const { trust, suspicion } = session.publicState;

    const revealedFactCount =session.hiddenState.revealedFactIds ?.length ?? 0;

    return (
        trust >= rule.minimumTrust &&
        suspicion <= rule.maximumSuspicion &&
        revealedFactCount >= (rule.minimumRevealedFacts ?? 0)
    );
};

const resolveCatRetrievalOutcome = (scenario, session, hasEnded) => {
    const { relocated, supervised } = scenario.game.outcomeRules;

    if (meetsOutcomeRule(relocated, session)) return 'relocated';

    if (!hasEnded) return null;

    if (meetsOutcomeRule(supervised, session)) 'supervised';

    return 'escalated';
};

const resolveAirlockOutcome = (scenario, session, hasEnded) => {
    const { admitted, quarantined } = scenario.game.outcomeRules;

    if (meetsOutcomeRule(admitted, session)) return 'admitted';

    if (!hasEnded) return null;

    if (meetsOutcomeRule(quarantined, session)) return 'quarantined';
    
    return 'rejected';
};

const resolveMurderProtocolOutcome = (scenario, session, hasEnded) => {
    const {exonerated, reopened } = scenario.game.outcomeRules;

    if (meetsOutcomeRule(exonerated, session)) return 'exonerated';

    if (!hasEnded) return null;
    
    if (meetsOutcomeRule(reopened, session)) return 'reopened';

    return 'convicted';
};

export const resolveGameOutcome = (scenario, session, hasEnded=false) => {
    switch (scenario.id) {
        case 'cat-retrieval-protocol':
            return resolveCatRetrievalOutcome(scenario, session, hasEnded);

        case 'airlock-protocol':
            return resolveAirlockOutcome(scenario, session, hasEnded);

        case 'murder-protocol':
            return resolveMurderProtocolOutcome(scenario, session, hasEnded);

        default:
            throw new Error(`No outcome resolver configured for scenario: ${scenario.id}`);
    }
};

export const completeGameSession = (session, result) => {
    session.status = 'completed';
    session.result = result;
    session.completedAt = new Date();
};