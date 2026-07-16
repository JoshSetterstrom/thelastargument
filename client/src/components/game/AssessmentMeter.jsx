import styles from './AssessmentMeter.module.css';

const AssessmentMeter = ({ label, value, danger=false }) => {
    const normalizedValue = Math.min(Math.max(Number(value) || 0, 0), 100);

    return (
        <div className={`${styles.wrapper} ${danger ? styles.danger : ''}`}>
            <div className={styles.header}>
                <span>{label}</span>
                <strong>{normalizedValue}%</strong>
            </div>

            <div className={styles.track}>
                <span style={{ width: `${normalizedValue}%` }}/>
            </div>
        </div>
    );
};

export default AssessmentMeter;