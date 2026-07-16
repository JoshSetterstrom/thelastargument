import styles from './Abandon.module.css';

const Abandon = ({ isAbandoning, onConfirm, onCancel }) => {
    return (
        <div className={styles.overlay}>
            <section className={styles.dialog} role="dialog" aria-modal="true">
                <span className={styles.code}>TERMINATION REQUEST</span>
                <h2 className={styles.title}>Abandon this scenario?</h2>
                <p>
                    The active communication channel will be terminated
                    and this attempt cannot be resumed.
                </p>

                <div className={styles.warning}>
                    <span>!</span>

                    Current messages, evidence submissions and negotiation
                    progress will be discarded.
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancel} onClick={onCancel} disabled={isAbandoning}>
                        Continue scenario
                    </button>

                    <button type="button" className={styles.confirm} onClick={onConfirm} disabled={isAbandoning} >
                        {isAbandoning ? 'Terminating...' : 'Abandon scenario'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Abandon;