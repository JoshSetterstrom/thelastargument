import { useEffect, useMemo, useState } from 'react';

import AssessmentMeter from './AssessmentMeter';
import Results from '../results/Results';
import Abandon from '../abandon/Abandon';
import Alert from '../alert/Alert';
import Header from '../header/Header';

import styles from './Game.module.css';
import Footer from '../footer/Footer';
import { useMusic } from '../../MusicProvider';
import axios from 'axios';
import Assessment from './Assessment';
import Conversation from './Conversation';
import Evidence from './Evidence';
import Discoveries from './Discoveries';

const formatTime = totalSeconds => {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const calculateRemainingSeconds = expiresAt => {
    const difference = new Date(expiresAt).getTime() - Date.now();

    return Math.max(0, Math.ceil(difference / 1000));
};

const Game = ({ initialGame, onRetry, onExit, onAbandon }) => {
    const [game, setGame] = useState(initialGame);
    const [message, setMessage] = useState('');
    const [selectedEvidenceId, setSelectedEvidenceId] = useState(null);
    const [remainingSeconds, setRemainingSeconds] = useState(() => calculateRemainingSeconds(initialGame.expiresAt));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
    const [isAbandoning, setIsAbandoning] = useState(false);
    const [newDiscoveries, setNewDiscoveries] = useState([]);

    const { setMusicTrack } = useMusic();

    const opponentName = game.scenario.opponentName;

    const isExpired = remainingSeconds <= 0;
    const isGameActive = game.status === 'active' && !game.result && !isExpired && game.turnsRemaining > 0;
    const selectedEvidence = useMemo(() => game.evidence.find(evidence => evidence.id === selectedEvidenceId), [game.evidence, selectedEvidenceId]);

    useEffect(() => {
        setGame(initialGame);
        setRemainingSeconds(calculateRemainingSeconds(initialGame.expiresAt));
    }, [initialGame]);

    useEffect(() => {
        if (game.status !== 'active' || game.result) return undefined;
        
        const interval = setInterval(() => {
            setRemainingSeconds(calculateRemainingSeconds(game.expiresAt));
        }, 250);

        return () => clearInterval(interval);
    }, [ game.expiresAt, game.result, game.status ]);

    useEffect(() => {
        const scenarioId = game?.scenario?.id;

        if (!scenarioId) return;

        void setMusicTrack(scenarioId);
    }, [game?.scenario?.id, setMusicTrack]);

    const handleSubmit = async event => {
        event.preventDefault();

        const content = message.trim();

        if (!content || isSubmitting || !isGameActive) return;

        const temporaryMessage = {
            id: `temporary-${Date.now()}`,
            role: 'user',
            content,
            evidenceId: selectedEvidenceId,
            createdAt: new Date().toISOString(),
            pending: true
        };

        setError(null);
        setIsSubmitting(true);
        setMessage('');

        setGame(current => ({ ...current, messages: [...current.messages, temporaryMessage] }));

        try {
            const response = await axios.post(`/api/games/${game.id}/messages`, { content, evidenceId: selectedEvidenceId ?? null })

            if (response.status !== 200) {
                throw new Error(result?.error?.message ?? 'The transmission could not be processed.');
            };

            const previousDiscoveryIds = new Set(game.discoveries?.map(discovery => discovery.id) ?? []);

            const incomingDiscoveries = response.data.discoveries ?? [];

            const newlyRevealed = incomingDiscoveries.filter(discovery => !previousDiscoveryIds.has(discovery.id));

            setGame(response.data);
            setSelectedEvidenceId(null);

            if (newlyRevealed.length > 0) setNewDiscoveries(newlyRevealed);
        } catch (error) {
            setError(error.message);

            setGame(current => ({ ...current, messages: current.messages.filter(currentMessage => currentMessage.id !== temporaryMessage.id) }));

            setMessage(content);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAbandon = async () => {
        if (isAbandoning) return;

        try {
            setIsAbandoning(true);
            setError(null);

            await onAbandon?.(game.id);
        } catch (error) {
            setError(error.message ?? 'Unable to terminate the scenario.');
            setShowAbandonConfirm(false);
            setIsAbandoning(false);
        };
    };

    const intelligence = game.intelligence ?? [];

    const recoveredCount = intelligence.filter(item => item.revealed).length;

    const timerClassName = [styles.timer, remainingSeconds <= 60 ? styles.timerCritical : ''].filter(Boolean).join(' ');

    const renderPage = () => {
        if (newDiscoveries.length > 0)
            return <Alert alerts={newDiscoveries} onClose={() => setNewDiscoveries([])} />;

        if (showAbandonConfirm && isGameActive)
            return <Abandon isAbandoning={isAbandoning} onConfirm={handleAbandon} onCancel={() => setShowAbandonConfirm(false)} />;

        if (!isGameActive)
            return <Results game={game} expired={isExpired} onExit={onExit} onRetry={onRetry} />;

        else return null;
    };

    return (
        <main className={styles.shell}>
            <div className={styles.grid} aria-hidden="true" />
            <div className={styles.scanlines} aria-hidden="true" />

            <section className={styles.terminal}>
                <Header
                    isGameActive={isGameActive}
                    setShowAbandonConfirm={setShowAbandonConfirm}
                    isSubmitting={isSubmitting}
                />

                <div className={styles.statusbar}>
                    <span>SCENARIO: {game.scenario.code}</span>
                    <span>LOCATION: {game.scenario.location}</span>
                    <span>TURNS: {game.turnsRemaining}</span>
                    <span className={timerClassName}>OXYGEN: {formatTime(remainingSeconds)}</span>
                </div>

                <div className={styles.layout}>
                    <aside className={styles.leftSidebar}>
                        <section className={styles.missionPanel}>
                            <span className={styles.missionLabel}>PRIMARY OBJECTIVE</span>

                            <p className={styles.missionText}>{game.scenario.objective}</p>
                        </section>

                        <Assessment game={game} />
                    </aside>

                    <Conversation
                        opponentName={opponentName}
                        messages={game.messages}
                        evidence={game.evidence}
                        message={message}
                        selectedEvidence={selectedEvidence}
                        error={error}
                        isSubmitting={isSubmitting}
                        isGameActive={isGameActive}
                        onMessageChange={setMessage}
                        onRemoveEvidence={() => setSelectedEvidenceId(null)}
                        onSubmit={handleSubmit}
                    />

                    <aside className={styles.rightSidebar}>
                        <Evidence
                            evidence={game.evidence}
                            selectedEvidenceId={selectedEvidenceId}
                            disabled={isSubmitting || !isGameActive}
                            onSelect={setSelectedEvidenceId}
                        />

                        <Discoveries intelligence={game.intelligence} />
                    </aside>
                </div>

                <Footer />
            </section>

            {renderPage()}
        </main>
    );
};

export default Game;