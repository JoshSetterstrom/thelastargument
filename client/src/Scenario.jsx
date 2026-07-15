import { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
import './Scenario.css';

function Scenario({ scenarios, onStart }) {
    const [selectedId, setSelectedId] = useState(scenarios[0]?.id ?? null);
    const [isStarting, setIsStarting] = useState(false);
    const [logs, setLogs] = useState([
        'Initializing remote negotiation terminal...',
        'Establishing encrypted uplink...',
        'Loading scenario archive...',
        'Operator authentication accepted.',
        'Awaiting scenario selection.'
    ]);

    const logRef = useRef(null);

    useEffect(() => {
        if (scenarios.length === 0) {
            setSelectedId(null);
            return;
        }

        setSelectedId(currentId => {
            const currentStillExists = scenarios.some(
                scenario => scenario.id === currentId
            );

            if (currentStillExists) {
                return currentId;
            }

            return (
                scenarios.find(
                    scenario => scenario.status === 'available'
                )?.id ??
                scenarios[0].id
            );
        });
    }, [scenarios]);

    useLayoutEffect(() => {
        const element = logRef.current;

        if (!element) return;

        element.scrollTop = element.scrollHeight;
    }, [logs]);

    const selectedScenario = useMemo(() => scenarios.find(scenario => scenario.id === selectedId), [selectedId]);

    const handleScenarioSelect = scenario => {
        if (scenario.status !== 'available' || isStarting) return;

        setSelectedId(scenario.id);

        setLogs(current => [
            ...current.slice(-5),
            `Scenario ${scenario.code} selected.`,
            `Loading negotiation profile: ${scenario.title}.`
        ]);
    };

    const handleStart = () => {
        if (!selectedScenario || isStarting) return;

        setIsStarting(true);

        setLogs(current => [
            ...current.slice(-5),
            `Opening secure channel to ${selectedScenario.location}...`,
            'Synchronizing mission clock...',
            'Negotiation session authorized.'
        ]);

        setTimeout(async () => {
            await onStart(selectedScenario.id);
            console.log('Start scenario:', selectedScenario.id);
        }, 1200);
    };

    return (
        <main className="terminal-shell">
            <div className="scanlines" aria-hidden="true" />
            <div className="ambient-glow" aria-hidden="true" />

            <section className="terminal">
                <header className="terminal__header">
                    <div className="terminal__identity">
                        <span className="terminal__mark">Λ</span>

                        <div>
                            <p className="terminal__eyebrow">
                                Strategic Intelligence Interface
                            </p>
                            <h1>The Last Argument</h1>
                        </div>
                    </div>

                    <div className="terminal__connection">
                        <span className="connection-light" />
                        Secure connection
                    </div>
                </header>

                <div className="terminal__statusbar">
                    <span>NODE: VAN-07</span>
                    <span>ACCESS: OPERATOR</span>
                    <span>PROTOCOL: PERSUASION</span>
                    <span className="terminal__status-active">SYSTEM ONLINE</span>
                </div>

                <div className="terminal__body">
                    <section className="scenario-browser">
                        <div className="section-heading">
                            <div>
                                <span className="section-number">01</span>
                                <h2>Select negotiation scenario</h2>
                            </div>

                            <span>{`${scenarios.length} record${scenarios.length === 1 ? '' : 's'} found`}</span>
                        </div>

                        <div className="scenario-list">
                            {scenarios.map(scenario => {
                                const isSelected = scenario.id === selectedId;
                                const isLocked = scenario.status !== 'available';

                                return (
                                    <button
                                        key={scenario.id}
                                        type="button"
                                        className={[
                                            'scenario-card',
                                            isSelected ? 'scenario-card--selected' : '',
                                            isLocked ? 'scenario-card--locked' : ''
                                        ].filter(Boolean).join(' ')}
                                        onClick={() => handleScenarioSelect(scenario)}
                                        disabled={isLocked}
                                        aria-pressed={isSelected}
                                    >
                                        <div className="scenario-card__topline">
                                            <span className="scenario-card__code">
                                                [{scenario.code}]
                                            </span>

                                            <span
                                                className={`scenario-card__status scenario-card__status--${scenario.status.toLowerCase()}`}
                                            >
                                                {scenario.status}
                                            </span>
                                        </div>

                                        <h3>{scenario.title}</h3>
                                        <p>{scenario.objective}</p>

                                        <div className="scenario-card__meta">
                                            <span>
                                                <small>Time</small>
                                                {scenario.duration}
                                            </span>

                                            <span>
                                                <small>Threat</small>
                                                {scenario.difficulty}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <aside className="scenario-details">
                        <div className="section-heading">
                            <div>
                                <span className="section-number">02</span>
                                <h2>Mission briefing</h2>
                            </div>
                        </div>

                        <div className="briefing">
                            <div className="briefing__classification">
                                <span>Scenario {selectedScenario.code}</span>
                                <strong>Restricted</strong>
                            </div>

                            <h3>{selectedScenario.title}</h3>

                            <dl className="briefing__data">
                                <div>
                                    <dt>Location</dt>
                                    <dd>{selectedScenario.location}</dd>
                                </div>

                                <div>
                                    <dt>Objective</dt>
                                    <dd>{selectedScenario.objective}</dd>
                                </div>
                            </dl>

                            <p className="briefing__description">
                                {selectedScenario.description}
                            </p>

                            <div className="briefing__warning">
                                <span>!</span>
                                The intelligence will assess logical consistency,
                                submitted evidence and manipulation attempts.
                            </div>
                        </div>

                        <div className="terminal-log">
                            <div className="terminal-log__header">
                                <span>System log</span>
                                <span>LIVE</span>
                            </div>

                            <div
                                ref={logRef}
                                className="terminal-log__messages"
                            >
                                {logs.map((log, index) => (
                                    <p key={`${log}-${index}`}>
                                        <span>&gt;</span>
                                        {log}
                                    </p>
                                ))}

                                <span className="terminal-cursor" />
                            </div>
                        </div>

                        <button
                            className="start-button"
                            type="button"
                            onClick={handleStart}
                            disabled={!selectedScenario || isStarting}
                        >
                            <span>
                                {isStarting ? 'Initializing session' : 'Start negotiation'}
                            </span>

                            <span aria-hidden="true">
                                {isStarting ? '...' : '↗'}
                            </span>
                        </button>
                    </aside>
                </div>

                <footer className="terminal__footer">
                    <span>LAST ARGUMENT SYSTEMS // BUILD 0.1.0</span>
                    <span>WORDS ARE YOUR ONLY ACCESS KEY</span>
                </footer>
            </section>
        </main>
    );
}

export default Scenario;