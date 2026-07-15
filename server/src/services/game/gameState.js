export const clamp = (value, minimum, maximum) => {
    return Math.min(
        Math.max(value, minimum),
        maximum
    );
};

export const applyTurnResult = (
    scenario,
    session,
    turnResult
) => {
    const {
        stateChanges,
        evaluation
    } = turnResult;

    session.publicState.trust = clamp(
        session.publicState.trust +
            stateChanges.trustDelta,
        0,
        100
    );

    session.publicState.suspicion = clamp(
        session.publicState.suspicion +
            stateChanges.suspicionDelta,
        0,
        100
    );

    session.hiddenState.pressure = clamp(
        session.hiddenState.pressure +
            stateChanges.pressureDelta,
        0,
        100
    );

    const validFactIds = new Set(
        scenario.game.hiddenFacts.map(fact => fact.id)
    );

    const revealedFactIds =
        turnResult.evaluation.revealedFactIds.filter(
            factId => validFactIds.has(factId)
        );

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

    if (
        evaluation.contradictionDetected &&
        evaluation.contradiction
    ) {
        session.hiddenState.contradictions = [
            ...new Set([
                ...session.hiddenState.contradictions,
                evaluation.contradiction
            ])
        ];
    }

    session.hiddenState.lastEvaluation = {
        argumentType: evaluation.argumentType,
        manipulationAttempt:
            evaluation.manipulationAttempt
    };

    session.turnsRemaining = Math.max(
        session.turnsRemaining - 1,
        0
    );
};

export const resolveGameOutcome = (
    scenario,
    session
) => {
    const {
        trust,
        suspicion
    } = session.publicState;

    const {
        admitted,
        quarantined
    } = scenario.game.outcomeRules;

    if (
        trust >= admitted.minimumTrust &&
        suspicion <= admitted.maximumSuspicion
    ) {
        return 'admitted';
    }

    const hasEnded =
        session.turnsRemaining <= 0 ||
        Date.now() >= session.expiresAt.getTime();

    if (!hasEnded) {
        return null;
    }

    if (
        trust >= quarantined.minimumTrust &&
        suspicion <= quarantined.maximumSuspicion
    ) {
        return 'quarantined';
    }

    return 'rejected';
};

export const completeGameSession = (session, result) => {
    session.status = 'completed';
    session.result = result;
    session.completedAt = new Date();
};