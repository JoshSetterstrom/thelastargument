import { useEffect, useState } from 'react';

import Initializing from './components/initializing/Initializing';
import Selection from './components/selection/Selection';
import Game from './components/game/Game';
import axios from 'axios';

import './App.css';

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

    const handleStartGame = async scenarioId => {
        try {
            setError(null);
            setInitializationSteps(gameLoadingSteps);
            setActiveStep(0);
            setIsInitializing(true);

            const response = await axios.post('/api/games', { scenarioId });

            if (response.status !== 200) {
                throw new Error(result?.error?.message ?? 'Unable to initialize the selected scenario.');
            };

            setActiveStep(1);

            sessionStorage.setItem('activeGameId', response.data.id);

            setGame(response.data);
            setActiveStep(2);
            setIsInitializing(false);
        } catch (error) {
            setError(error.message);
        };
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
        const response = await axios.post(`/api/games/${gameId}/abandon`);

        if (response.status !== 200) {
            throw new Error(result?.error?.message ?? 'Unable to abandon the scenario.');
        };

        sessionStorage.removeItem('activeGameId');

        setGame(null);
    };

    useEffect(() => {
        const controller = new AbortController();

        const initialize = async () => {
            try {
                setIsInitializing(true);
                setError(null);
                setActiveStep(0);

                const activeGameId = sessionStorage.getItem('activeGameId');

                const scenarioRequest = await axios.get('/api/scenarios', { signal: controller.signal });
                const gameRequest = activeGameId && axios.get(`/api/games/${activeGameId}`, { signal: controller.signal });

                if (scenarioRequest.status !== 200) {
                    throw new Error(scenarioRequest?.error?.message ?? 'Unable to retrieve scenario records.');
                };

                setScenarios(scenarioRequest.data);
                setActiveStep(1);

                if (gameRequest) setGame(gameRequest.data);
                else sessionStorage.removeItem('activeGameId');

                setActiveStep(2);
                
                setTimeout(() => setIsInitializing(false), 1000);
            } catch (error) {
                if (error.name !== 'CanceledError') setError(error.message);
            };
        };

        initialize();

        return () => controller.abort();
    }, []);

    if (isInitializing || error) 
        return <Initializing activeStep={activeStep} steps={initializationSteps} error={error} />;
    if (game) 
        return <Game initialGame={game} onRetry={onRetry} onExit={onExit} onAbandon={onAbandon}/>;

    return <Selection scenarios={scenarios} onStart={handleStartGame} />;
};

export default App;