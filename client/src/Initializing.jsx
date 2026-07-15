import { useEffect, useState } from 'react';
import './Initializing.css';

const defaultSteps = [
    'Establishing encrypted connection',
    'Authenticating operator credentials',
    'Retrieving scenario archive',
    'Loading negotiation protocols',
    'Synchronizing local terminal'
];

const InitializingScreen = ({ activeStep=0, steps=defaultSteps, error=null }) => {
    const [visibleSteps, setVisibleSteps] = useState([]);

    useEffect(() => {
        setVisibleSteps(current => {
            const next = steps.slice(0, activeStep + 1);

            return next.length >= current.length ? next : current;
        });
    }, [activeStep, steps]);

    return (
        <main className="initializing-screen">
            <div className="initializing-screen__grid" aria-hidden="true" />
            <div className="initializing-screen__scanlines" aria-hidden="true" />

            <section className="initializing-terminal">
                <header className="initializing-terminal__header">
                    <span className="initializing-terminal__logo">Λ</span>

                    <div className="initializing-terminal__title">
                        <span className="initializing-terminal__eyebrow">
                            Strategic Intelligence Interface
                        </span>

                        <h1>The Last Argument</h1>
                    </div>

                    <span
                        className={[ 'initializing-terminal__connection', error ? 'initializing-terminal__connection--error' : '' ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        <i />
                        {error ? 'Connection failure' : 'Secure uplink'}
                    </span>
                </header>

                <div className="initializing-terminal__content">
                    <div className="initializing-terminal__status">
                        <span className="initializing-terminal__code">
                            SYS_INIT // VAN-07
                        </span>

                        <h2>
                            {error ? 'Initialization interrupted' : 'Initializing terminal'}
                            {!error && <span className="loading-dots" />}
                        </h2>

                        <p>
                            {error ? error : 'Preparing the negotiation environment. Do not disconnect.'}
                        </p>
                    </div>

                    {!error && (
                        <div
                            className="initializing-progress"
                            role="progressbar"
                            aria-label="Initializing application"
                        >
                            <span />
                        </div>
                    )}

                    <div className="initializing-log">
                        <div className="initializing-log__header">
                            <span>Boot sequence</span>
                            <span>{error ? 'HALTED' : 'ACTIVE'}</span>
                        </div>

                        <div className="initializing-log__body">
                            {visibleSteps.map((step, index) => {
                                const isActive = index === activeStep;

                                return (
                                    <div
                                        className={[ 'initializing-log__line', isActive ? 'initializing-log__line--active' : '' ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        key={step}
                                    >
                                        <span className="initializing-log__prefix">
                                            {index < activeStep ? '[OK]' : '[..]'}
                                        </span>

                                        <span>{step}</span>
                                    </div>
                                );
                            })}

                            {!error && <span className="initializing-log__cursor" />}
                        </div>
                    </div>

                    <div className="initializing-terminal__telemetry">
                        <div>
                            <span>Encryption</span>
                            <strong>AES-256</strong>
                        </div>

                        <div>
                            <span>Protocol</span>
                            <strong>Persuasion</strong>
                        </div>

                        <div>
                            <span>Operator</span>
                            <strong>Authenticated</strong>
                        </div>
                    </div>
                </div>

                <footer className="initializing-terminal__footer">
                    <span>LAST ARGUMENT SYSTEMS // BUILD 0.1.0</span>
                    <span>CONNECTION MUST REMAIN ACTIVE</span>
                </footer>
            </section>
        </main>
    );
};

export default InitializingScreen;