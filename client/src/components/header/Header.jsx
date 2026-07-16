import styles from './Header.module.css';

const Header = ({ isGameActive, setShowAbandonConfirm, isSubmitting }) => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <span className={styles.mark}>Λ</span>

                <div className={styles.titleWrapper}>
                    <p className={styles.eyebrow}>Strategic Intelligence Interface</p>
                    <h1 className={styles.title}>The Last Argument</h1>
                </div>
            </div>

            <div className={styles.right}>
                <span className={styles.light} />
                Secure connection
                {isGameActive && (
                    <button type="button" className={styles.abandon} onClick={setShowAbandonConfirm?.bind(null, true)} disabled={isSubmitting} >
                        Abandon scenario
                    </button>
                )}
            </div>

        </header>
    )
};

export default Header;