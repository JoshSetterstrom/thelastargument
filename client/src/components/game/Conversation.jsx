import { useEffect, useLayoutEffect, useRef } from 'react';

import { useMusic } from '../../MusicProvider';

import styles from './Conversation.module.css';

const Conversation = ({ opponentName, messages, evidence, message, selectedEvidence, error, isSubmitting, isGameActive, onMessageChange, onRemoveEvidence, onSubmit }) => {
    const conversationRef = useRef(null);
    const textareaRef = useRef(null);
    const lastKeySoundAt = useRef(0);

    const { playKeySound } = useMusic();

    useLayoutEffect(() => {
        const conversation = conversationRef.current;

        if (!conversation) return;

        conversation.scrollTo({ top: conversation.scrollHeight, behavior: 'smooth' });
    }, [ messages, isSubmitting ]);

    useEffect(() => {
        if (!isSubmitting && isGameActive) textareaRef.current?.focus();
    }, [ isSubmitting, isGameActive ]);

    const handleKeyDown = event => {
        const shouldIgnoreSound = event.repeat || event.ctrlKey || event.altKey || event.metaKey;

        if (!shouldIgnoreSound) {
            const isPrintableKey = event.key.length === 1;
            const isEffectKey = [ 'Backspace', 'Delete', 'Enter' ].includes(event.key);

            const now = performance.now();

            const canPlaySound = (isPrintableKey || isEffectKey) && now - lastKeySoundAt.current >= 28;

            if (canPlaySound) {
                lastKeySoundAt.current = now;

                let soundType = 'key';

                if (event.key === 'Backspace' || event.key === 'Delete') soundType = 'backspace';
                else if (event.key === 'Enter') soundType = 'enter';

                void playKeySound(soundType);
            };
        };

        if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
            event.preventDefault();

            event.currentTarget.form?.requestSubmit();
        };
    };

    const renderMessages = messages.map(message => {
        const messageClassName = [
            styles.message,
            message.role === 'assistant' ? styles.assistantMessage : styles.userMessage,
            message.pending ? styles.pendingMessage : ''
        ].filter(Boolean).join(' ');

        const attachedEvidence = message.evidenceId ? evidence.find(item => (item.id === message.evidenceId)) : null;

        return (
            <article key={message.id} className={messageClassName}>
                <header className={styles.messageHeader}>
                    <span>{message.role === 'assistant' ? opponentName : 'OPERATOR'}</span>

                    <time>
                        {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </time>
                </header>

                {attachedEvidence && (
                    <div className={styles.messageEvidence}>
                        EVIDENCE ATTACHED //{' '}
                        {attachedEvidence.title}
                    </div>
                )}

                <p className={styles.messageBody}>{message.content}</p>

                {message.pending && (
                    <span className={styles.messagePending}>
                        TRANSMITTING
                        <i />
                        <i />
                        <i />
                    </span>
                )}
            </article>
        );
    })

    return (
        <section className={styles.panel}>
            <header className={styles.heading}>
                <div className={styles.headingIdentity}>
                    <span className={styles.headingIndex}>02</span>

                    <h2 className={styles.headingTitle}>Secure communication</h2>
                </div>

                <span className={styles.headingStatus}>ENCRYPTED // LIVE</span>
            </header>

            <div className={styles.conversation} ref={conversationRef} aria-live="polite">
                <div className={styles.notice}>
                    <span>SYSTEM</span>

                    Communication channel established
                    with {` ${opponentName}`}. All
                    transmissions are being analyzed.
                </div>

                {renderMessages}

                {isSubmitting && (
                    <div className={styles.thinking}>
                        <span>{opponentName}</span>

                        Processing transmission
                        <i />
                        <i />
                        <i />
                    </div>
                )}

                {!isGameActive && (
                    <div className={styles.closed}>
                        <span>SESSION TERMINATED</span>

                        The negotiation channel is no
                        longer accepting transmissions.
                    </div>
                )}
            </div>

            <form
                className={styles.form}
                onSubmit={onSubmit}
            >
                {selectedEvidence && (
                    <div className={styles.selectedEvidence}>
                        <div>
                            <span>ATTACHMENT READY</span>

                            <strong>
                                {selectedEvidence.title}
                            </strong>
                        </div>

                        <button
                            type="button"
                            className={
                                styles.removeEvidenceButton
                            }
                            onClick={onRemoveEvidence}
                            aria-label="Remove selected evidence"
                        >
                            ×
                        </button>
                    </div>
                )}

                {error && (
                    <div
                        className={styles.transmissionError}
                        role="alert"
                    >
                        <span>TRANSMISSION ERROR</span>

                        {error}
                    </div>
                )}

                <div className={styles.field}>
                    <span className={styles.prompt}>
                        &gt;
                    </span>

                    <textarea
                        ref={textareaRef}
                        className={styles.textarea}
                        value={message}
                        onChange={event => {
                            onMessageChange(
                                event.target.value
                            );
                        }}
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

                <div className={styles.formFooter}>
                    <span>
                        {message.length}/800 CHARACTERS
                        {' // '}
                        ENTER TO TRANSMIT
                    </span>

                    <button
                        type="submit"
                        className={styles.submitButton}
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
    );
};

export default Conversation;