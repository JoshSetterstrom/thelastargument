import { useMusic } from '../../MusicProvider';
import styles from './Footer.module.css';

const Footer = () => {
    const {
        isPlaying,
        isMuted,
        volume,
        toggleMusic,
        setVolume
    } = useMusic();

    const audioEnabled =
        isPlaying &&
        !isMuted &&
        volume > 0;

    const volumePercentage = Math.round(
        volume * 100
    );

    const handleVolumeChange = event => {
        setVolume(
            Number(event.target.value) / 100
        );
    };

    return (
        <footer className={styles.footer}>
            <span className={styles.identity}>
                LAST ARGUMENT // NEGOTIATION TERMINAL
            </span>

            <div className={styles.controls}>
                <div className={styles.audioControls}>
                    <button
                        type="button"
                        className={[
                            styles.audio,
                            audioEnabled
                                ? styles.audioActive
                                : ''
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        onClick={toggleMusic}
                        aria-label={
                            audioEnabled
                                ? 'Mute background music'
                                : 'Play background music'
                        }
                        aria-pressed={audioEnabled}
                    >
                        <span
                            className={styles.audioIndicator}
                            aria-hidden="true"
                        />

                        <span>
                            AUDIO {audioEnabled ? 'ON' : 'OFF'}
                        </span>
                    </button>

                    <label className={styles.volumeControl}>
                        <span>VOL</span>

                        <input
                            className={styles.volumeSlider}
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={volumePercentage}
                            onChange={handleVolumeChange}
                            aria-label="Background music volume"
                            style={{
                                '--volume':
                                    `${volumePercentage}%`
                            }}
                        />

                        <span className={styles.volumeValue}>
                            {String(volumePercentage).padStart(
                                2,
                                '0'
                            )}
                        </span>
                    </label>
                </div>

                <span
                    className={styles.separator}
                    aria-hidden="true"
                >
                    /
                </span>

                <a
                    className={styles.link}
                    href="https://github.com/joshsetterstrom/thelastargument"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View The Last Argument source code on GitHub"
                >
                    <span>[GITHUB]</span>
                    <span>View source</span>
                    <span aria-hidden="true">↗</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;