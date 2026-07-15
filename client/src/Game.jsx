import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import './Game.css';

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

const getSpeakerName = (message, opponentName) => {
    if (message.role === 'assistant') {
        return opponentName;
    }

    return 'OPERATOR';
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

    const conversationRef = useRef(null);
    const textareaRef = useRef(null);

    const opponentName =
        game.scenario.opponentName ??
        'AURA';

    const isExpired = remainingSeconds <= 0;

    const isGameActive =
        game.status === 'active' &&
        !game.result &&
        !isExpired &&
        game.turnsRemaining > 0;

    const selectedEvidence = useMemo(() => {
        return game.evidence.find(
            evidence => evidence.id === selectedEvidenceId
        );
    }, [game.evidence, selectedEvidenceId]);

    useEffect(() => {
        setGame(initialGame);
        setRemainingSeconds(
            calculateRemainingSeconds(initialGame.expiresAt)
        );
    }, [initialGame]);

    useEffect(() => {
        if (game.status !== 'active' || game.result) {
            return undefined;
        }

        const interval = setInterval(() => {
            setRemainingSeconds(
                calculateRemainingSeconds(game.expiresAt)
            );
        }, 250);

        return () => clearInterval(interval);
    }, [
        game.expiresAt,
        game.result,
        game.status
    ]);

    useEffect(() => {
        const conversation = conversationRef.current;

        if (!conversation) {
            return;
        }

        conversation.scrollTo({
            top: conversation.scrollHeight,
            behavior: 'smooth'
        });
    }, [
        game.messages,
        isSubmitting
    ]);

    useEffect(() => {
        if (!isSubmitting && isGameActive) {
            textareaRef.current?.focus();
        }
    }, [
        isSubmitting,
        isGameActive
    ]);

    const handleEvidenceSelect = evidence => {
        if (
            evidence.submitted ||
            isSubmitting ||
            !isGameActive
        ) {
            return;
        }

        setSelectedEvidenceId(currentId =>
            currentId === evidence.id
                ? null
                : evidence.id
        );
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const content = message.trim();

        if (
            !content ||
            isSubmitting ||
            !isGameActive
        ) {
            return;
        }

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

        setGame(current => ({
            ...current,
            messages: [
                ...current.messages,
                temporaryMessage
            ]
        }));

        try {
            const response = await fetch(
                `/api/games/${game.id}/messages`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, evidenceId: selectedEvidenceId ?? null })
                }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) throw new Error(result?.error?.message ?? 'The transmission could not be processed.');

            const previousDiscoveryIds = new Set(
                game.discoveries?.map(discovery => discovery.id) ?? []
            );

            const incomingDiscoveries =
                result.data.discoveries ?? [];

            const newlyRevealed = incomingDiscoveries.filter(
                discovery => !previousDiscoveryIds.has(discovery.id)
            );

            setGame(result.data);
            setSelectedEvidenceId(null);

            if (newlyRevealed.length > 0) {
                setNewDiscoveries(newlyRevealed);
            };
        } catch (error) {
            setError(error.message);

            setGame(current => ({
                ...current,
                messages: current.messages.filter(
                    currentMessage =>
                        currentMessage.id !==
                        temporaryMessage.id
                )
            }));

            setMessage(content);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = event => {
        if (
            event.key !== 'Enter' ||
            event.shiftKey
        ) {
            return;
        }

        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
    };

    const handleAbandon = async () => {
        if (isAbandoning) {
            return;
        }

        try {
            setIsAbandoning(true);
            setError(null);

            await onAbandon?.(game.id);
        } catch (error) {
            setError(
                error.message ??
                'Unable to terminate the scenario.'
            );

            setShowAbandonConfirm(false);
            setIsAbandoning(false);
        }
    };

    const intelligence = game.intelligence ?? [];

    const recoveredCount = intelligence.filter(
        item => item.revealed
    ).length;

    return (
        <main className="game-shell">
            <div
                className="game-shell__grid"
                aria-hidden="true"
            />

            <div
                className="game-shell__scanlines"
                aria-hidden="true"
            />

            <section className="game-terminal">
                <header className="game-header">
                    <div className="game-header__identity">
                        <span className="game-header__mark">
                            Λ
                        </span>

                        <div>
                            <span className="game-header__eyebrow">
                                Strategic Intelligence Interface
                            </span>

                            <h1>
                                {game.scenario.title}
                            </h1>
                        </div>
                    </div>

                    <div className="game-header__controls">
                        <div className="game-header__status">
                            <span
                                className={[
                                    'game-header__light',
                                    !isGameActive
                                        ? 'game-header__light--inactive'
                                        : ''
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            />

                            {isGameActive
                                ? 'Channel active'
                                : 'Channel closed'}
                        </div>

                        {isGameActive && (
                            <button
                                type="button"
                                className="game-header__abandon"
                                onClick={() => setShowAbandonConfirm(true)}
                                disabled={isSubmitting}
                            >
                                Abandon scenario
                            </button>
                        )}
                    </div>
                </header>

                <div className="game-statusbar">
                    <span>
                        SCENARIO: {game.scenario.code}
                    </span>

                    <span>
                        LOCATION: {game.scenario.location}
                    </span>

                    <span>
                        TURNS: {game.turnsRemaining}
                    </span>

                    <span
                        className={[
                            'game-statusbar__timer',
                            remainingSeconds <= 60
                                ? 'game-statusbar__timer--critical'
                                : ''
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        OXYGEN: {formatTime(remainingSeconds)}
                    </span>
                </div>

                <div className="game-layout">
                    <aside className="game-left-sidebar">
                        <section className="mission-panel">
                            <span>
                                PRIMARY OBJECTIVE
                            </span>

                            <p>
                                {game.scenario.objective}
                            </p>
                        </section>

                        <section className="assessment-panel">
                            <header className="panel-heading">
                                <div>
                                    <span>01</span>
                                    <h2>AI assessment</h2>
                                </div>
                            </header>

                            <AssessmentMeter
                                label="Trust"
                                value={game.state.trust}
                            />

                            <AssessmentMeter
                                label="Suspicion"
                                value={game.state.suspicion}
                                danger
                            />

                            <div className="assessment-panel__warning">
                                Assessment values are inferred from behavioural
                                analysis and may not reflect the intelligence&apos;s
                                final decision.
                            </div>
                        </section>
                    </aside>

                    <section className="conversation-panel">
                        <header className="panel-heading">
                            <div>
                                <span>02</span>
                                <h2>
                                    Secure communication
                                </h2>
                            </div>

                            <span>
                                ENCRYPTED // LIVE
                            </span>
                        </header>

                        <div
                            className="conversation"
                            ref={conversationRef}
                        >
                            <div className="conversation__notice">
                                <span>
                                    SYSTEM
                                </span>

                                Communication channel established
                                with {` ${opponentName}`}.
                                All transmissions are being
                                analyzed.
                            </div>

                            {game.messages.map(currentMessage => (
                                <article
                                    key={currentMessage.id}
                                    className={[
                                        'message',
                                        `message--${currentMessage.role}`,
                                        currentMessage.pending
                                            ? 'message--pending'
                                            : ''
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                >
                                    <header className="message__header">
                                        <span>
                                            {getSpeakerName(
                                                currentMessage,
                                                opponentName
                                            )}
                                        </span>

                                        <time>
                                            {new Date(
                                                currentMessage.createdAt
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                }
                                            )}
                                        </time>
                                    </header>

                                    {currentMessage.evidenceId && (
                                        <div className="message__evidence">
                                            EVIDENCE ATTACHED //{' '}
                                            {
                                                game.evidence.find(
                                                    evidence =>
                                                        evidence.id ===
                                                        currentMessage.evidenceId
                                                )?.title
                                            }
                                        </div>
                                    )}

                                    <p>
                                        {currentMessage.content}
                                    </p>

                                    {currentMessage.pending && (
                                        <span className="message__pending">
                                            TRANSMITTING
                                            <i />
                                            <i />
                                            <i />
                                        </span>
                                    )}
                                </article>
                            ))}

                            {isSubmitting && (
                                <div className="ai-thinking">
                                    <span>
                                        {opponentName}
                                    </span>

                                    Processing transmission
                                    <i />
                                    <i />
                                    <i />
                                </div>
                            )}

                            {!isGameActive && (
                                <div className="conversation__closed">
                                    <span>
                                        SESSION TERMINATED
                                    </span>

                                    The negotiation channel is no
                                    longer accepting transmissions.
                                </div>
                            )}
                        </div>

                        <form
                            className="transmission-form"
                            onSubmit={handleSubmit}
                        >
                            {selectedEvidence && (
                                <div className="selected-evidence">
                                    <div>
                                        <span>
                                            ATTACHMENT READY
                                        </span>

                                        <strong>
                                            {selectedEvidence.title}
                                        </strong>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedEvidenceId(null)
                                        }
                                        aria-label="Remove selected evidence"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {error && (
                                <div
                                    className="transmission-error"
                                    role="alert"
                                >
                                    <span>TRANSMISSION ERROR</span>
                                    {error}
                                </div>
                            )}

                            <div className="transmission-form__field">
                                <span className="transmission-form__prompt">
                                    &gt;
                                </span>

                                <textarea
                                    ref={textareaRef}
                                    value={message}
                                    onChange={event =>
                                        setMessage(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={handleKeyDown}
                                    placeholder={
                                        isGameActive
                                            ? 'Enter your argument...'
                                            : 'Communication channel closed'
                                    }
                                    rows="3"
                                    maxLength="800"
                                    disabled={
                                        !isGameActive ||
                                        isSubmitting
                                    }
                                />
                            </div>

                            <div className="transmission-form__footer">
                                <span>
                                    {message.length}/800 CHARACTERS
                                    // ENTER TO TRANSMIT
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        !message.trim() ||
                                        isSubmitting ||
                                        !isGameActive
                                    }
                                >
                                    {isSubmitting
                                        ? 'Transmitting'
                                        : 'Transmit'}
                                    <span aria-hidden="true">
                                        ↗
                                    </span>
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className="game-sidebar">
                        <section className="evidence-panel">
                            <header className="panel-heading">
                                <div>
                                    <span>03</span>
                                    <h2>
                                        Available evidence
                                    </h2>
                                </div>

                                <span>
                                    {
                                        game.evidence.filter(
                                            evidence =>
                                                !evidence.submitted
                                        ).length
                                    }{' '}
                                    REMAINING
                                </span>
                            </header>

                            <div className="evidence-list">
                                {game.evidence.map(evidence => {
                                    const isSelected =
                                        evidence.id ===
                                        selectedEvidenceId;

                                    return (
                                        <button
                                            key={evidence.id}
                                            type="button"
                                            className={[
                                                'evidence-card',
                                                isSelected
                                                    ? 'evidence-card--selected'
                                                    : '',
                                                evidence.submitted
                                                    ? 'evidence-card--submitted'
                                                    : ''
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                            disabled={
                                                evidence.submitted ||
                                                isSubmitting ||
                                                !isGameActive
                                            }
                                            onClick={() =>
                                                handleEvidenceSelect(
                                                    evidence
                                                )
                                            }
                                        >
                                            <strong>
                                                {evidence.title}
                                            </strong>

                                            <p>
                                                {evidence.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="discoveries-panel">
                            <header className="panel-heading">
                                <div>
                                    <span>04</span>
                                    <h2>Hidden intelligence</h2>
                                </div>

                                <span>
                                    {recoveredCount}/{intelligence.length} RECOVERED
                                </span>
                            </header>

                            <div className="discoveries-list">
                                {intelligence.map(item => (
                                    <div
                                        key={item.index+1}
                                        className={[
                                            'discovery-record',
                                            item.revealed
                                                ? 'discovery-record--revealed'
                                                : 'discovery-record--encrypted'
                                        ].join(' ')}
                                        title={
                                            item.revealed
                                                ? item.text
                                                : undefined
                                        }
                                    >
                                        <span className="discovery-record__index">
                                            {String(item.index+1).padStart(2, '0')}
                                        </span>

                                        <span className="discovery-record__text">
                                            {item.revealed
                                                ? item.text
                                                : 'Intelligence unavailable'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>

                <footer className="game-footer">
                    <span>
                        SESSION // {game.id.slice(0, 8).toUpperCase()}
                    </span>

                    <span>
                        WORDS ARE YOUR ONLY ACCESS KEY
                    </span>
                </footer>
            </section>

            {newDiscoveries.length > 0 && (
                <DiscoveryAlert
                    discoveries={newDiscoveries}
                    onClose={() => setNewDiscoveries([])}
                />
            )}

            {showAbandonConfirm && isGameActive && (
                <AbandonDialog
                    isAbandoning={isAbandoning}
                    onConfirm={handleAbandon}
                    onCancel={() => setShowAbandonConfirm(false)}
                />
            )}

            {!isGameActive && (
                <GameResult
                    game={game}
                    expired={isExpired}
                    onExit={onExit}
                    onRetry={onRetry}
                />
            )}
        </main>
    );
};

const AssessmentMeter = ({ label, value, danger=false }) => {
    const normalizedValue = Math.min(Math.max(Number(value) || 0, 0), 100);

    return (
        <div
            className={[
                'assessment-meter',
                danger ? 'assessment-meter--danger' : ''
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className="assessment-meter__header">
                <span>{label}</span>
                <strong>{normalizedValue}%</strong>
            </div>

            <div className="assessment-meter__track">
                <span
                    style={{ width: `${normalizedValue}%` }}
                />
            </div>
        </div>
    );
};

const GameResult = ({ game, expired, onRetry, onExit }) => {
    const result = game.result ?? ( expired ? 'rejected' : 'terminated' );

    const content =
        game.scenario.resultContent?.[result] ?? {
            code: 'SESSION TERMINATED',
            title: 'Negotiation ended',
            description:
                'The negotiation session has concluded.'
        };

    return (
        <div className="result-overlay">
            <section className="result-dialog">
                <span className="result-dialog__code">
                    {content.code}
                </span>

                <h2>{content.title}</h2>

                <p>{content.description}</p>

                <div className="result-dialog__metrics">
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

                <div className="result-dialog__actions">
                    <button
                        type="button"
                        className="result-dialog__retry"
                        onClick={() => onRetry?.(game.scenario.id)}
                    >
                        <span>Retry scenario</span>
                        <span aria-hidden="true">↻</span>
                    </button>

                    <button
                        type="button"
                        className="result-dialog__exit"
                        onClick={onExit}
                    >
                        <span>Scenario archive</span>
                        <span aria-hidden="true">←</span>
                    </button>
                </div>
            </section>
        </div>
    );
};

const DiscoveryAlert = ({
    discoveries,
    onClose
}) => {
    return (
        <div className="discovery-alert">
            <div className="discovery-alert__header">
                <div>
                    <span className="discovery-alert__code">
                        INTELLIGENCE RECOVERED
                    </span>

                    <h2>
                        New information discovered
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close discovery notification"
                >
                    ×
                </button>
            </div>

            <div className="discovery-alert__items">
                {discoveries.map(discovery => (
                    <p key={discovery.id}>
                        <span>&gt;</span>
                        {discovery.text}
                    </p>
                ))}
            </div>

            <button
                type="button"
                className="discovery-alert__acknowledge"
                onClick={onClose}
            >
                Acknowledge
            </button>
        </div>
    );
};

const AbandonDialog = ({ isAbandoning, onConfirm, onCancel }) => {
    return (
        <div className="abandon-overlay">
            <section
                className="abandon-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="abandon-dialog-title"
            >
                <span className="abandon-dialog__code">
                    TERMINATION REQUEST
                </span>

                <h2 id="abandon-dialog-title">
                    Abandon this scenario?
                </h2>

                <p>
                    The active communication channel will be terminated
                    and this attempt cannot be resumed.
                </p>

                <div className="abandon-dialog__warning">
                    <span>!</span>

                    Current messages, evidence submissions and negotiation
                    progress will be discarded.
                </div>

                <div className="abandon-dialog__actions">
                    <button
                        type="button"
                        className="abandon-dialog__cancel"
                        onClick={onCancel}
                        disabled={isAbandoning}
                    >
                        Continue scenario
                    </button>

                    <button
                        type="button"
                        className="abandon-dialog__confirm"
                        onClick={onConfirm}
                        disabled={isAbandoning}
                    >
                        {isAbandoning
                            ? 'Terminating...'
                            : 'Abandon scenario'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Game;