import styles from './Alert.module.css';

const Alert = ({ alerts, onClose }) => {
    const renderAlerts = alerts.map(alert => (
        <p key={alert.id}>
            <span>&gt;</span>
            {alert.text}
        </p>
    ))

    return (
        <div className={styles.alert}>
            <div className={styles.header}>
                <div>
                    <span className={styles.code}>INTELLIGENCE RECOVERED</span>
                    <h2 className={styles.title}>New information discovered</h2>
                </div>

                <button type="button" onClick={onClose} aria-label="Close discovery notification" >×</button>
            </div>

            <div className={styles.items}>{renderAlerts}</div>

            <button type="button" className={styles.acknowledge} onClick={onClose}>Acknowledge</button>
        </div>
    );
};

export default Alert;