import styles from './Discoveries.module.css';

const Discoveries = ({ intelligence=[] }) => {
    const recoveredCount = intelligence.filter(item => item.revealed).length;

    const renderItems = intelligence.map(item => {
        const className = [
            styles.record,
            item.revealed ? styles.revealed : styles.encrypted
        ].filter(Boolean).join(' ');

        return (
            <div
                key={item.index}
                className={className}
                title={item.revealed ? item.text : undefined}
            >
                <span className={styles.recordIndex}>
                    {String(item.index).padStart(2, '0')}
                </span>

                <span className={styles.recordText}>
                    {item.revealed ? item.text : 'Intelligence unavailable'}
                </span>
            </div>
        );
    })

    return (
        <section className={styles.panel}>
            <header className={styles.heading}>
                <div className={styles.headingIdentity}>
                    <span className={styles.headingIndex}>04</span>

                    <h2 className={styles.headingTitle}>Hidden intelligence</h2>
                </div>

                <span className={styles.recovered}>
                    {recoveredCount}/{intelligence.length}{' '}
                    RECOVERED
                </span>
            </header>

            <div className={styles.list}>{renderItems}</div>
        </section>
    );
};

export default Discoveries;