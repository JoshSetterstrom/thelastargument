import { useEffect, useState } from 'react';

import Initializing from './Initializing';
import Scenario from './Scenario';
import Game from './Game';

const scenarioLoadingSteps = [
    'Retrieving scenario archive',
    'Processing scenario records',
    'Terminal ready'
];

const gameLoadingSteps = [
    'Creating negotiation session',
    'Synchronizing mission clock',
    'Opening secure communication channel'
];

const App = () => {
    const [isInitializing, setIsInitializing] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [initializationSteps, setInitializationSteps] = useState(scenarioLoadingSteps);
    const [scenarios, setScenarios] = useState([]);
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const initialize = async () => {
            try {
                setIsInitializing(true);
                setError(null);
                setActiveStep(0);

                const activeGameId =
                    sessionStorage.getItem('activeGameId');

                const scenarioRequest = fetch('/api/scenarios', {
                    signal: controller.signal
                });

                const gameRequest = activeGameId
                    ? fetch(`/api/games/${activeGameId}`, {
                        signal: controller.signal
                    })
                    : null;

                const scenarioResponse = await scenarioRequest;
                const scenarioResult = await scenarioResponse
                    .json()
                    .catch(() => null);

                if (!scenarioResponse.ok) {
                    throw new Error(
                        scenarioResult?.error?.message ??
                        'Unable to retrieve scenario records.'
                    );
                }

                setScenarios(scenarioResult.data);
                setActiveStep(1);

                if (gameRequest) {
                    const gameResponse = await gameRequest;
                    const gameResult = await gameResponse
                        .json()
                        .catch(() => null);

                    if (gameResponse.ok) {
                        setGame(gameResult.data);
                    } else {
                        sessionStorage.removeItem('activeGameId');
                    }
                }

                setActiveStep(2);
                setIsInitializing(false);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError(error.message);
                }
            }
        };

        initialize();

        return () => controller.abort();
    }, []);

    const handleStartGame = async scenarioId => {
        try {
            setError(null);
            setInitializationSteps(gameLoadingSteps);
            setActiveStep(0);
            setIsInitializing(true);

            const response = await fetch('/api/games', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    scenarioId
                })
            });

            const result = await response
                .json()
                .catch(() => null);

            if (!response.ok) {
                throw new Error(
                    result?.error?.message ??
                    'Unable to initialize the selected scenario.'
                );
            }

            setActiveStep(1);

            sessionStorage.setItem(
                'activeGameId',
                result.data.id
            );

            setGame(result.data);
            setActiveStep(2);
            setIsInitializing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const onRetry = scenarioId => {
        sessionStorage.removeItem('activeGameId');

        handleStartGame(scenarioId);
    };

    const onExit = () => {
        sessionStorage.removeItem('activeGameId');
        setGame(null);
    };

    const onAbandon = async gameId => {
        const response = await fetch(`/api/games/${gameId}/abandon`, { method: 'POST' });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                result?.error?.message ??
                'Unable to abandon the scenario.'
            );
        }

        sessionStorage.removeItem('activeGameId');
        setGame(null);
    };

    if (isInitializing || error) return <Initializing activeStep={activeStep} steps={initializationSteps} error={error} />;
        
    if (game) return <Game initialGame={game} onRetry={onRetry} onExit={onExit} onAbandon={onAbandon}/>;

    return <Scenario scenarios={scenarios} onStart={handleStartGame} />;
};

export default App;