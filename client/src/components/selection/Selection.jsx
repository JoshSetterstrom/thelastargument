import { useMemo, useState, useRef, useEffect, useLayoutEffect } from 'react';
// import './Selection.css';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Browser from './Browser';
import Details from './Details';

import styles from './Selection.module.css';
import { useMusic } from '../../MusicProvider';

const defaultLogs = [
    'Initializing remote negotiation terminal...',
    'Establishing encrypted uplink...',
    'Loading scenario archive...',
    'Operator authentication accepted.',
    'Awaiting scenario selection.'
]

function Selection({ scenarios, onStart }) {
    const [selectedId, setSelectedId] = useState(scenarios[0]?.id ?? null);
    const [isStarting, setIsStarting] = useState(false);
    const [logs, setLogs] = useState(defaultLogs);

    const logRef = useRef(null);

    const { startMusic } = useMusic();

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

            await startMusic(selectedScenario.id);
        }, 1200);
    };

    useEffect(() => {
        if (scenarios.length === 0) return setSelectedId(null);

        setSelectedId(currentId => {
            const currentStillExists = scenarios.some(scenario => scenario.id === currentId);

            if (currentStillExists) return currentId;
            
            return scenarios.find(scenario => scenario.status === 'available')?.id ?? scenarios[0].id;
        });
    }, [scenarios]);

    useLayoutEffect(() => {
        const element = logRef.current;

        if (!element) return;

        element.scrollTop = element.scrollHeight;
    }, [logs]);

    return (
        <main className={styles.wrapper}>
            <div className={styles.scanlines} aria-hidden="true" />
            <div className={styles.glow} aria-hidden="true" />

            <section className={styles.terminal}>
                <Header />

                <div className={styles.statusbar}>
                    <span>NODE: VAN-07</span>
                    <span>ACCESS: OPERATOR</span>
                    <span>PROTOCOL: PERSUASION</span>
                    <span className={styles.active}>SYSTEM ONLINE</span>
                </div>

                <div className={styles.body}>
                    <Browser 
                        scenarios={scenarios} 
                        selectedId={selectedId} 
                        handleScenarioSelect={handleScenarioSelect}
                    />

                    <Details 
                        selectedScenario={selectedScenario} 
                        logRef={logRef} 
                        logs={logs} 
                        handleStart={handleStart} 
                        isStarting={isStarting}
                    />
                </div>

                <Footer />
            </section>
        </main>
    );
};

export default Selection;