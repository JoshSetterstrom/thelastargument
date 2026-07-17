import styles from './Evidence.module.css';

const Evidence = ({ evidence, selectedEvidenceId, disabled, onSelect }) => {
    const remainingCount = evidence.filter(item => !item.submitted).length;

    const handleSelect = item => {
        if (disabled || item.submitted) return;

        onSelect(item.id === selectedEvidenceId ? null : item.id);
    };

    const renderEvidence = evidence.map(item => {
        const isSelected = item.id === selectedEvidenceId;

        const className = [
            styles.card,
            isSelected ? styles.selected : '',
            item.submitted ? styles.submitted : ''
        ].filter(Boolean).join(' ');

        return (
            <button
                key={item.id}
                type="button"
                className={className}
                disabled={item.submitted || disabled}
                aria-pressed={isSelected}
                onClick={() => handleSelect(item)}
            >
                <strong className={styles.title}>{item.title}</strong>
                <p className={styles.description}>{item.description}</p>
            </button>
        );
    })

    return (
        <section className={styles.panel}>
            <header className={styles.heading}>
                <div className={styles.headingIdentity}>
                    <span className={styles.headingIndex}>03</span>

                    <h2 className={styles.headingTitle}>Available evidence</h2>
                </div>

                <span className={styles.remaining}>{remainingCount} REMAINING</span>
            </header>

            <div className={styles.list}>
                {renderEvidence}
            </div>
        </section>
    );
};

export default Evidence;