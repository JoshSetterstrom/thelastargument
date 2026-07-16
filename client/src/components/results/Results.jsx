import styles from './Results.module.css';

const Results = ({ game, expired, onRetry, onExit }) => {
    const result = game.result ?? ( expired ? 'rejected' : 'terminated' );

    const content = game.scenario.resultContent?.[result] ?? {
        code: 'SESSION TERMINATED',
        title: 'Negotiation ended',
        description: 'The negotiation session has concluded.'
    };

    return (
        <div className={styles.overlay}>
            <section className={styles.dialog}>
                <span className={styles.code}>{content.code}</span>

                <h2>{content.title}</h2>

                <p>{content.description}</p>

                <div className={styles.metrics}>
                    <div>
                        <span>Final trust</span>
                        <strong>{game.state.trust}%</strong>
                    </div>

                    <div>
                        <span>Final suspicion</span>
                        <strong>{game.state.suspicion}%</strong>
                    </div>

                    <div>
                        <span>Turns remaining</span>
                        <strong>{game.turnsRemaining}</strong>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.retry} onClick={onRetry.bind(null, game.scenario.id)}>
                        <span>Retry scenario</span>
                        <span aria-hidden="true" className={styles.icon}>↻</span>
                    </button>

                    <button type="button" className={styles.exit} onClick={onExit}>
                        <span>Scenario archive</span>
                        <span aria-hidden="true" className={styles.icon}>←</span>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Results;