const getPublicDiscoveries = (session, scenario) => {
    const revealedFactIds = new Set(session.hiddenState.revealedFactIds ?? []);

    return scenario.game.hiddenFacts
        .filter(hiddenFact => (revealedFactIds.has(hiddenFact.id) && hiddenFact.reveal?.publicText))
        .map(hiddenFact => ({
            id: hiddenFact.id,
            text: hiddenFact.reveal.publicText
        }));
};

const getPublicIntelligence = (session, scenario) => {
    const revealedFactIds = new Set(session.hiddenState.revealedFactIds ?? []);

    return scenario.game.hiddenFacts
        .filter(fact => fact.reveal?.type !== 'inference-only')
        .sort((a, b) => a.index - b.index)
        .map(fact => {
            const revealed = revealedFactIds.has(fact.id);

            return {
                index: fact.index,
                revealed,
                text: revealed ? fact.reveal.publicText : null
            };
        });
};

export const toPublicGameSession = (session, scenario) => {
    const { code, title, location, objective, briefing, durationSeconds, difficulty, resultContent } = scenario.public;

    return {
        id: session.id,
        scenario: {
            id: scenario.id,
            code,
            title,
            location,
            objective,
            briefing,
            durationSeconds,
            difficulty,
            resultContent,
            opponentName: scenario.game.opponent.name
        },
        intelligence: getPublicIntelligence(session, scenario),
        status: session.status,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
        turnsRemaining: session.turnsRemaining,
        state: {
            trust: session.publicState.trust,
            suspicion: session.publicState.suspicion
        },
        evidence: session.evidence.map(evidence => ({
            id: evidence.id,
            title: evidence.title,
            description: evidence.description,
            submitted: evidence.submitted
        })),
        discoveries: getPublicDiscoveries(session, scenario),
        messages: session.messages,
        result: session.result,
        completedAt: session.completedAt
    };
};