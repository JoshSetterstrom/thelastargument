import airlockProtocol from './airlockProtocol.js';
import murderProtocol from './murderProtocol.js';
import catRetrievalProtocol from './catRetrivalProtocol.js';

const scenarios = new Map([
    [airlockProtocol.id, airlockProtocol],
    [murderProtocol.id, murderProtocol],
    [catRetrievalProtocol.id, catRetrievalProtocol]
]);

export const getScenarios = () => {
    return [...scenarios.values()];
};

export const getScenarioById = id => {
    return scenarios.get(id);
};