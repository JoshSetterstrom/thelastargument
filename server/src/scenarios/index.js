import airlockProtocol from './airlockProtocol.js';

const scenarios = new Map([
    [airlockProtocol.id, airlockProtocol]
]);

export const getScenarios = () => {
    return [...scenarios.values()];
};

export const getScenarioById = id => {
    return scenarios.get(id);
};