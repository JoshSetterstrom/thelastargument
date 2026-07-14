import { useEffect, useState } from 'react';
import Initializing from './Initializing';
import Scenario from './Scenario';

const App = () => {
    const [isInitializing, setIsInitializing] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [scenarios, setScenarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const initialize = async () => {
            try {
                setActiveStep(0);

                const scenarioResponse = await fetch('/api/scenarios', { signal: controller.signal });
                if (!scenarioResponse.ok) throw new Error('Unable to retrieve scenario records.');
                
                setActiveStep(1);

                const scenarioData = await scenarioResponse.json();

                setScenarios(scenarioData.data);
                setActiveStep(2);

                setIsInitializing(false);
            } catch (error) {
                if (error.name !== 'AbortError') setError(error.message);
            };
        };

        initialize();

        return () => controller.abort();
    }, []);

    if (isInitializing || error) return <Initializing activeStep={activeStep} error={error} />
    
    return <Scenario scenarios={scenarios} />;
};

export default App;