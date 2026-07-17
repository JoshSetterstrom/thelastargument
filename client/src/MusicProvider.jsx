import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';

import airlockMusic from './assets/airlock_protocol.wav';
import murderMusic from './assets/murder_protocol.wav';
import switchMusic from './assets/dead_mans_switch.wav';

const MUSIC_TRACKS = {
    'airlock-protocol': airlockMusic,
    'murder-protocol': murderMusic,
    'dead-mans-switch': switchMusic
};

const MusicContext = createContext(null);

const DEFAULT_VOLUME = 0.18;

const clamp = (value, minimum, maximum) => {
    return Math.min(
        Math.max(value, minimum),
        maximum
    );
};

export const MusicProvider = ({ children }) => {
    const audioRef = useRef(null);
    const effectsContextRef = useRef(null);
    const currentTrackRef = useRef(null);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isMuted, setIsMuted] = useState(() => {
        return (
            localStorage.getItem('music-muted') ===
            'true'
        );
    });

    const [volume, setVolumeState] = useState(() => {
        const storedVolume =
            localStorage.getItem('music-volume');

        if (storedVolume === null) {
            return DEFAULT_VOLUME;
        }

        const parsedVolume = Number(storedVolume);

        return Number.isFinite(parsedVolume)
            ? clamp(parsedVolume, 0, 1)
            : DEFAULT_VOLUME;
    });

    const volumeRef = useRef(volume);
    const mutedRef = useRef(isMuted);

    useEffect(() => {
        volumeRef.current = volume;
        mutedRef.current = isMuted;
    }, [volume, isMuted]);

    useEffect(() => {
        const audio = new Audio();

        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = volumeRef.current;
        audio.muted = mutedRef.current;

        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.removeAttribute('src');
            audio.load();

            audioRef.current = null;

            if (effectsContextRef.current) {
                effectsContextRef.current.close();
                effectsContextRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        localStorage.setItem(
            'music-volume',
            String(volume)
        );

        localStorage.setItem(
            'music-muted',
            String(isMuted)
        );

        if (!audio) return;

        audio.volume = volume;
        audio.muted = isMuted;
    }, [volume, isMuted]);

    const setVolume = useCallback(nextVolume => {
        const normalizedVolume = clamp(
            Number(nextVolume),
            0,
            1
        );

        setVolumeState(normalizedVolume);

        setIsMuted(normalizedVolume === 0);
    }, []);

    const setMusicTrack = useCallback(async scenarioId => {
        const source = MUSIC_TRACKS[scenarioId];

        if (!source) {
            console.warn(
                `No music configured for scenario: ${scenarioId}`
            );

            return;
        }

        const audio = audioRef.current;

        if (
            !audio ||
            currentTrackRef.current === scenarioId
        ) {
            return;
        }

        const wasPlaying = !audio.paused;

        audio.pause();
        audio.src = source;
        audio.currentTime = 0;
        audio.volume = volumeRef.current;
        audio.muted = mutedRef.current;
        audio.load();

        currentTrackRef.current = scenarioId;
        setCurrentTrack(scenarioId);

        if (!wasPlaying) return;

        try {
            await audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.warn(
                'Scenario music could not start:',
                error
            );

            setIsPlaying(false);
        }
    }, []);


    const startMusic = useCallback(async scenarioId => {
        if (scenarioId) {
            await setMusicTrack(scenarioId);
        }

        const audio = audioRef.current;

        audio.volume = 0.05;

        if (!audio || !audio.src || !audio.paused) {
            return;
        }

        try {
            await audio.play();
            setIsPlaying(true);
        } catch (error) {
            console.warn(
                'Music could not start:',
                error
            );
        }
    }, [setMusicTrack]);

    const toggleMusic = useCallback(async () => {
        const audio = audioRef.current;

        if (!audio) return;

        if (audio.paused) {
            let nextVolume = volume;

            if (nextVolume === 0) {
                nextVolume = DEFAULT_VOLUME;
                setVolumeState(nextVolume);
                audio.volume = nextVolume;
            }

            audio.muted = false;
            setIsMuted(false);

            try {
                await audio.play();
                setIsPlaying(true);
            } catch (error) {
                console.warn(
                    'Music could not start:',
                    error
                );
            }

            return;
        }

        if (isMuted) {
            if (volume === 0) {
                setVolumeState(DEFAULT_VOLUME);
                audio.volume = DEFAULT_VOLUME;
            }

            audio.muted = false;
            setIsMuted(false);
        } else {
            audio.muted = true;
            setIsMuted(true);
        }
    }, [isMuted, volume]);

    const playKeySound = useCallback(async type => {
        if (isMuted || volume <= 0) return;

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) return;

        let context = effectsContextRef.current;

        if (!context || context.state === 'closed') {
            context = new AudioContextClass();
            effectsContextRef.current = context;
        }

        if (context.state === 'suspended') {
            await context.resume();
        }

        const now = context.currentTime;

        const profiles = {
            key: {
                frequency: 720 + Math.random() * 140,
                duration: 0.018,
                noiseAmount: 0.28
            },

            backspace: {
                frequency: 480 + Math.random() * 60,
                duration: 0.026,
                noiseAmount: 0.38
            },

            enter: {
                frequency: 340 + Math.random() * 45,
                duration: 0.045,
                noiseAmount: 0.18
            }
        };

        const profile =
            profiles[type] ??
            profiles.key;

        // Keep effects much quieter than the music.
        const effectVolume = Math.min(
            volume * 0.11,
            0.028
        );

        /*
        * Tonal component
        */
        const oscillator = context.createOscillator();
        const oscillatorGain = context.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(
            profile.frequency,
            now
        );

        oscillatorGain.gain.setValueAtTime(
            effectVolume,
            now
        );

        oscillatorGain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + profile.duration
        );

        oscillator.connect(oscillatorGain);
        oscillatorGain.connect(context.destination);

        oscillator.start(now);
        oscillator.stop(now + profile.duration);

        /*
        * Very small noise component to make it feel tactile.
        */
        const frameCount = Math.ceil(
            context.sampleRate * profile.duration
        );

        const noiseBuffer = context.createBuffer(
            1,
            frameCount,
            context.sampleRate
        );

        const noiseData = noiseBuffer.getChannelData(0);

        for (
            let index = 0;
            index < frameCount;
            index += 1
        ) {
            noiseData[index] =
                Math.random() * 2 - 1;
        }

        const noiseSource =
            context.createBufferSource();

        const noiseFilter =
            context.createBiquadFilter();

        const noiseGain =
            context.createGain();

        noiseSource.buffer = noiseBuffer;

        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(
            profile.frequency * 2.2,
            now
        );
        noiseFilter.Q.setValueAtTime(0.8, now);

        noiseGain.gain.setValueAtTime(
            effectVolume * profile.noiseAmount,
            now
        );

        noiseGain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + profile.duration
        );

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(context.destination);

        noiseSource.start(now);
        noiseSource.stop(now + profile.duration);
    }, [isMuted, volume]);


    return (
        <MusicContext.Provider
            value={{
                isPlaying,
                isMuted,
                volume,
                currentTrack,
                startMusic,
                setMusicTrack,
                toggleMusic,
                setVolume,
                playKeySound
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);

    if (!context) {
        throw new Error(
            'useMusic must be used inside MusicProvider'
        );
    }

    return context;
};