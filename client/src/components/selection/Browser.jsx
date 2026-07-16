import styles from './Browser.module.css';

const Browser = ({ scenarios, selectedId, handleScenarioSelect }) => {
    const renderScenarios = scenarios.map(scenario => {
        const selected = scenario.id === selectedId;
        const disabled = scenario.status !== 'available';

        return (
            <button
                key={scenario.id}
                type="button"
                className={`${styles.card} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
                onClick={handleScenarioSelect.bind(null, scenario)}
                disabled={disabled}
                aria-pressed={selected}
            >
                <div className={styles.topline}>
                    <span className={styles.code}>[{scenario.code}]</span>

                    <span className={`${styles.status} ${styles[scenario.status.toLowerCase()]}`}>
                        {scenario.status}
                    </span>
                </div>

                <h3>{scenario.title}</h3>
                <p>{scenario.objective}</p>

                <div className={styles.meta}>
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
    })

    return (
        <section className={styles.browser}>
            <div className={styles.header}>
                <div>
                    <span className={styles.section}>01</span>
                    <h2>Select negotiation scenario</h2>
                </div>

                <span>{`${scenarios.length} record${scenarios.length === 1 ? '' : 's'} found`}</span>
            </div>

            <div className={styles.list}>{renderScenarios}</div>
        </section>
    );
};

export default Browser;