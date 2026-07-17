import AssessmentMeter from './AssessmentMeter';

import styles from './Assessment.module.css';

const Assessment = ({ game }) => {
    return (
        <section className={styles.panel}>
            <header className={styles.heading}>
                <span className={styles.index}>
                    01
                </span>

                <h2 className={styles.title}>
                    AI assessment
                </h2>
            </header>

            <div className={styles.meters}>
                <AssessmentMeter
                    label="Trust"
                    value={game.state.trust}
                />

                <AssessmentMeter
                    label="Suspicion"
                    value={game.state.suspicion}
                    danger
                />
            </div>

            <p className={styles.warning}>
                Assessment values are inferred from
                behavioural analysis and may not reflect
                the intelligence&apos;s final decision.
            </p>
        </section>
    );
};

export default Assessment;