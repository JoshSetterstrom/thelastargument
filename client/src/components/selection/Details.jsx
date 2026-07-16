import styles from './Details.module.css';

const Details = ({ selectedScenario, logRef, logs, handleStart, isStarting }) => {
    const renderLogs = logs.map((log, index) => (
        <p key={`${log}-${index}`}>
            <span>&gt;</span>
            {log}
        </p>
    ));
    
    return (
        <aside className={styles.details}>
            <div className={styles.header}>
                <div>
                    <span className={styles.section}>02</span>
                    <h2>Mission briefing</h2>
                </div>
            </div>

            <div className={styles.briefing}>
                <div className={styles.classification}>
                    <span>Scenario {selectedScenario.code}</span>
                    <strong>Restricted</strong>
                </div>

                <h3>{selectedScenario.title}</h3>

                <dl className={styles.data}>
                    <div>
                        <dt>Location</dt>
                        <dd>{selectedScenario.location}</dd>
                    </div>

                    <div>
                        <dt>Objective</dt>
                        <dd>{selectedScenario.objective}</dd>
                    </div>
                </dl>

                <p className={styles.description}>{selectedScenario.description}</p>

                <div className={styles.warning}>
                    <span>!</span>
                    The intelligence will assess logical consistency,
                    submitted evidence and manipulation attempts.
                </div>
            </div>

            <div className={styles.terminal}>
                <div className={styles.terminalHeader}>
                    <span>System log</span>
                    <span>LIVE</span>
                </div>

                <div ref={logRef} className={styles.terminalMessages}>
                    {renderLogs}

                    <span className={styles.cursor} />
                </div>
            </div>

            <button
                className={styles.start}
                type="button"
                onClick={handleStart}
                disabled={!selectedScenario || isStarting}
            >
                <span>{isStarting ? 'Initializing session' : 'Start negotiation'}</span>
                <span aria-hidden="true">{isStarting ? '...' : '↗'}</span>
            </button>
        </aside>
    );
};

export default Details;